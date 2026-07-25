from cinis.millions import Agent, AgentConfig
from cinis.cortex import Orchestrator

# Define agent configuration
config = AgentConfig(
    name="scout-monitor-v1",
    type="scout",                    # scout, builder, reasoning, etc.
    description="Monitors industrial sensors for anomalies",
    parameters={
        "sensors": ["temperature", "vibration", "pressure"],
        "alert_threshold": 0.85,
        "check_interval": 30,        # seconds
        "offline_mode": True
    },
    governance_policies=["data-sovereignty", "deterministic"]
)

# Create the agent
agent = Agent(config=config)

# Register with the orchestrator
orchestrator = Orchestrator()
orchestrator.register(agent)

# Deploy (local/offline)
agent.deploy(mode="edge")   # or "local", "netlify"

print(f"Agent {agent.name} created and deployed successfully!")
