/* ============================================
   BACKEND: Member Payload Endpoint
   Provides complete member dashboard data (access grants + content)
   Add this to backend/server.js in the routes section
   ============================================ */

app.get('/api/member-payload', verifyToken, async (req, res) => {
  try {
    const userEmail = req.query.email || req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Get access grants for user
    const grants = await dbAll(
      'SELECT product, order_ref, granted_at, active FROM access_grants WHERE email = ? AND active = 1',
      [userEmail]
    );

    // Get member stats
    const user = await dbGet(
      'SELECT id, email, name, created_at FROM users WHERE email = ?',
      [userEmail]
    );

    // Load podcast registry
    let podcasts = [];
    const podcastRegistryPath = path.join(__dirname, '..', 'content-output', 'podcast', 'registry.json');
    if (fs.existsSync(podcastRegistryPath)) {
      podcasts = JSON.parse(fs.readFileSync(podcastRegistryPath, 'utf-8'));
    }

    // Filter podcasts to those user has access to
    const hasContentAccess = grants.some(g => g.product === '30-Day AI Content System' || g.product === 'Cortex Platform');
    const accessibleContent = hasContentAccess ? podcasts.map(p => ({
      type: 'podcast',
      id: p.episode_id,
      title: p.title,
      slug: p.slug,
      path: `/content-output/podcast/${p.filename}`,
      created_at: p.created_at,
      status: 'unlocked'
    })) : [];

    res.json({
      user_email: userEmail,
      member_since: user?.created_at || new Date().toISOString(),
      access_grants: grants,
      content: accessibleContent,
      message: `Welcome to Cortex Intelligence Nexus. You have ${grants.length} active subscription(s).`
    });
  } catch (err) {
    console.error('Member payload error:', err);
    res.status(500).json({ error: 'Failed to load member data' });
  }
});

/* ============================================
   BACKEND: Metrics Pulse Endpoint
   Exports metrics summary for Platform Pulse dashboard
   Add this to backend/server.js in the routes section
   ============================================ */

app.get('/api/metrics/pulse', verifyToken, async (req, res) => {
  try {
    const metricsDir = path.join(__dirname, '..', 'content-output', 'metrics');
    
    if (!fs.existsSync(metricsDir)) {
      return res.json({
        brand: 'Cortex Intelligence Nexus',
        generated_at: new Date().toISOString(),
        periods: {
          week: { podcast_listens: 0, content_views: 0, offer_clicks: 0, conversions: 0, total_revenue_ngn: 0, conversion_rate: 0, unique_members: 0 },
          month: { podcast_listens: 0, content_views: 0, offer_clicks: 0, conversions: 0, total_revenue_ngn: 0, conversion_rate: 0, unique_members: 0 },
          year: { podcast_listens: 0, content_views: 0, offer_clicks: 0, conversions: 0, total_revenue_ngn: 0, conversion_rate: 0, unique_members: 0 }
        },
        health_status: { member_growth: 'early', engagement: 'warming_up', revenue: 'early', conversion_efficiency: 'optimize' }
      });
    }

    // Load and aggregate metrics
    const calculatePeriodMetrics = (days) => {
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const metrics = { podcast_listens: 0, content_views: 0, offer_clicks: 0, conversions: 0, total_revenue_ngn: 0, unique_members: new Set() };

      // Count listens
      const listensPath = path.join(metricsDir, 'podcast_listens.json');
      if (fs.existsSync(listensPath)) {
        const listens = JSON.parse(fs.readFileSync(listensPath, 'utf-8'));
        listens.forEach(e => {
          if (new Date(e.timestamp) > cutoffDate) {
            metrics.podcast_listens++;
            metrics.unique_members.add(e.user_email);
          }
        });
      }

      // Count views
      const viewsPath = path.join(metricsDir, 'content_views.json');
      if (fs.existsSync(viewsPath)) {
        const views = JSON.parse(fs.readFileSync(viewsPath, 'utf-8'));
        views.forEach(e => {
          if (new Date(e.timestamp) > cutoffDate) {
            metrics.content_views++;
            metrics.unique_members.add(e.user_email);
          }
        });
      }

      // Count clicks
      const clicksPath = path.join(metricsDir, 'offer_clicks.json');
      if (fs.existsSync(clicksPath)) {
        const clicks = JSON.parse(fs.readFileSync(clicksPath, 'utf-8'));
        clicks.forEach(e => {
          if (new Date(e.timestamp) > cutoffDate) {
            metrics.offer_clicks++;
          }
        });
      }

      // Count conversions + revenue
      const conversionsPath = path.join(metricsDir, 'conversions.json');
      if (fs.existsSync(conversionsPath)) {
        const conversions = JSON.parse(fs.readFileSync(conversionsPath, 'utf-8'));
        conversions.forEach(e => {
          if (new Date(e.timestamp) > cutoffDate) {
            metrics.conversions++;
            metrics.total_revenue_ngn += (e.amount_ngn || 0);
            metrics.unique_members.add(e.email);
          }
        });
      }

      metrics.unique_members = metrics.unique_members.size;
      metrics.conversion_rate = metrics.offer_clicks > 0 ? ((metrics.conversions / metrics.offer_clicks) * 100).toFixed(2) : 0;
      return metrics;
    };

    const week = calculatePeriodMetrics(7);
    const month = calculatePeriodMetrics(30);
    const year = calculatePeriodMetrics(365);

    // Calculate health status
    const health = {
      member_growth: month.unique_members > 50 ? 'strong' : month.unique_members > 10 ? 'growing' : 'early',
      engagement: month.podcast_listens > month.conversions * 5 ? 'strong' : month.podcast_listens > 0 ? 'active' : 'warming_up',
      revenue: month.total_revenue_ngn > 500000 ? 'strong' : month.total_revenue_ngn > 100000 ? 'growing' : 'early',
      conversion_efficiency: month.conversion_rate > 10 ? 'excellent' : month.conversion_rate > 2 ? 'healthy' : 'optimize'
    };

    res.json({
      brand: 'Cortex Intelligence Nexus',
      generated_at: new Date().toISOString(),
      periods: { week, month, year },
      health_status: health
    });
  } catch (err) {
    console.error('Metrics pulse error:', err);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});
