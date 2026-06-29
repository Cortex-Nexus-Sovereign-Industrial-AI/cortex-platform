import express from "express";

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (!req.session?.tokens?.access_token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "unauthenticated",
        message: "Login required before deploy execution."
      }
    });
  }
  next();
}

function ensurePolicyAllowed(req, res, next) {
  const policy = req.body?.policy;

  if (!policy) {
    return res.status(400).json({
      success: false,
      error: {
        code: "missing_policy",
        message: "Policy object is required."
      }
    });
  }

  if (policy.authorized !== true) {
    return res.status(403).json({
      success: false,
      error: {
        code: "policy_denied",
        message: "Deployment blocked by policy."
      }
    });
  }

  if (policy.mode === "approved" && !policy.approval_id) {
    return res.status(403).json({
      success: false,
      error: {
        code: "approval_required",
        message: "Approval ID is required for approved mode."
      }
    });
  }

  next();
}

router.post("/deploy", ensureAuthenticated, ensurePolicyAllowed, async (req, res) => {
  const { status, message, deployer, metadata, policy } = req.body || {};

  if (!status || !message || !deployer || !metadata) {
    return res.status(400).json({
      success: false,
      error: {
        code: "invalid_payload",
        message: "status, message, deployer, and metadata are required."
      }
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      deployment_id: `dep_${Date.now()}`,
      status,
      policy_decision: "allowed",
      reviewed_by: req.session.user?.sub || "session",
      reviewed_at: new Date().toISOString()
    }
  });
});

export default router;
