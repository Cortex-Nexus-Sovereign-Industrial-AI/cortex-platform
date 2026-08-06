/**
 * Simple session-based auth guard.
 * Protects member routes until a real identity provider is fully wired.
 */

function requireAuth(req, res, next) {
  const authenticated = Boolean(req.session?.tokens?.access_token);

  if (!authenticated) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'unauthorized',
        message: 'Authentication required. Visit /auth/login to begin.'
      }
    });
  }

  return next();
}

module.exports = requireAuth;
