from cinis.millions import Agent, AgentConfig
from cinis.cortex import Orchestrator

config = AgentConfig(
    name="scout-factory-floor",
    type="scout",
    description="Monitors temperature, vibration, and pressure on production line",
    parameters={
        "sensors": ["temperature", "vibration", "pressure"],
        "alert_threshold": 0.85,
        "check_interval": 30,
        "offline_mode": True,
        "auto_heal": True
    },
    governance_policies=["data-sovereignty", "deterministic"]
)

# Create and register agent
agent = Agent(config=config)
orchestrator = Orchestrator()
orchestrator.register(agent)

# Deploy in edge/offline mode
deployment_result = agent.deploy(mode="edge")

print(f"✅ Scout Agent deployed: {deployment_result}")
