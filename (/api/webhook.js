// Sovereign Ingress Webhook Endpoint
// Handles TikTok / Multi-Module Webhooks & Streams Data to GA4 + WhatsApp Alerts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body || {};
  const transactionId = payload?.data?.order_id || payload?.transaction_id || `TX-${Date.now()}`;
  const amount = payload?.data?.payment_amount || payload?.amount || 0.0;
  const sourceModule = payload?.source || 'TikTok_Multi_Module';

  // Target WhatsApp recipient
  const recipientPhone = process.env.WHATSAPP_TO_NUMBER || "09010251577";

  try {
    // Concurrent execution: Stream to GA4 Analytics and dispatch WhatsApp Alert
    const [gaRes, waRes] = await Promise.allSettled([
      streamToGA4(transactionId, amount, sourceModule),
      sendWhatsAppAlert(recipientPhone, `🚨 *REVENUE EVENT*\n\nSource: *${sourceModule}*\nID: \`${transactionId}\`\nAmount: *$${amount}*`)
    ]);

    if (waRes.status === 'rejected') {
      console.error('WhatsApp dispatch error:', waRes.reason);
    }

    return res.status(200).json({ status: 'SUCCESS', transactionId, timestamp: new Date().toISOString() });

  } catch (err) {
    console.error('Pipeline Execution Error:', err);
    
    // Fail-safe alert to WhatsApp so the agent never drops silently
    await sendWhatsAppAlert(recipientPhone, `⚠️ *PIPELINE FAILURE*: Error on TX \`${transactionId}\`: ${err.message}`);
    
    return res.status(500).json({ error: 'Internal Pipeline Failure', details: err.message });
  }
}

async function streamToGA4(transactionId, amount, source) {
  const GA_ID = process.env.GA4_MEASUREMENT_ID;
  const API_SECRET = process.env.GA4_API_SECRET;
  
  if (!GA_ID || !API_SECRET) {
    console.warn("GA4 Credentials missing. Skipping GA4 event dispatch.");
    return;
  }

  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${API_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: `user_${transactionId}`,
      events: [{
        name: 'purchase',
        params: {
          currency: 'USD',
          value: amount,
          transaction_id: transactionId,
          source: source
        }
      }]
    })
  });
}

async function sendWhatsAppAlert(toPhone, messageText) {
  const WA_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!WA_TOKEN || !PHONE_ID) {
    console.warn("WhatsApp API credentials missing. Skipping notification dispatch.");
    return;
  }

  const response = await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: messageText }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`WhatsApp API responded with status ${response.status}: ${errText}`);
  }
}
