export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  const transactionId = payload?.data?.order_id || `TX-${Date.now()}`;
  const amount = payload?.data?.payment_amount || 0.0;

  try {
    // 1. Parallel execution: Stream to GA4 & Notify WhatsApp
    const [gaRes, waRes] = await Promise.allSettled([
      streamToGA4(transactionId, amount),
      sendWhatsAppAlert(`🚨 *REVENUE EVENT*\nID: \`${transactionId}\`\nAmount: *$${amount}*`)
    ]);

    // Check if WhatsApp notification failed
    if (waRes.status === 'rejected') {
      console.error('WhatsApp dispatch error:', waRes.reason);
    }

    // 2. Acknowledge source immediately (200 OK)
    return res.status(200).json({ status: 'SUCCESS', transactionId });

  } catch (err) {
    // 3. Fallback alert so the agent NEVER fails silently
    console.error('Pipeline Execution Error:', err);
    await sendWhatsAppAlert(`⚠️ *PIPELINE ALERT*: Execution failed on TX: ${transactionId}. Error: ${err.message}`);
    
    return res.status(500).json({ error: 'Internal Pipeline Error', details: err.message });
  }
}

// Stream to GA4 Measurement Protocol
async function streamToGA4(transactionId, amount) {
  const GA_ID = process.env.GA4_MEASUREMENT_ID;
  const API_SECRET = process.env.GA4_API_SECRET;
  
  if (!GA_ID || !API_SECRET) return;

  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${API_SECRET}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: `user_${transactionId}`,
      events: [{
        name: 'purchase',
        params: {
          currency: 'USD',
          value: amount,
          transaction_id: transactionId,
          source: 'autonomous_pipeline'
        }
      }]
    })
  });
}

// Dispatch to WhatsApp Cloud API
async function sendWhatsAppAlert(messageText) {
  const WA_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const TO_NUMBER = process.env.WHATSAPP_TO_NUMBER;

  if (!WA_TOKEN || !PHONE_ID) return;

  const response = await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: TO_NUMBER,
      type: 'text',
      text: { body: messageText }
    })
  });

  if (!response.ok) {
    throw new Error(`WhatsApp API responded with status ${response.status}`);
  }
}
