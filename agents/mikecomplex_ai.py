from cinis.millions import Agent, AgentConfig
import time
import os
import json
from datetime import datetime

class MikeComplexAI(Agent):
    def __init__(self):
        config = AgentConfig(
            name="mikecomplex-ai-core",
            type="reasoning",
            description="Adaptive offline intelligence core with sensor integration",
            parameters={
                "offline_mode": True,
                "phone_state_detection": True,
                "metric_rendering": True,
                "self_healing": True,
                "sensor_polling_interval": 30
            }
        )
        super().__init__(config)
        self.sensor_log = "logs/sensor_data.jsonl"
        os.makedirs("logs", exist_ok=True)

    def read_phone_sensors(self):
        """Simulated + real sensor reading (extendable)"""
        try:
            # Simulated real sensor data
            state = {
                "timestamp": datetime.now().isoformat(),
                "screen": self._detect_screen_state(),
                "charging": self._detect_charging(),
                "battery_level": self._get_battery_level(),
                "movement": self._detect_movement(),
                "light_level": self._get_light_level(),  # ambient light
                "activity_level": "high" if time.time() % 120 < 60 else "low"
            }
            
            # Log to local file (offline)
            with open(self.sensor_log, "a") as f:
                f.write(json.dumps(state) + "\n")
            
            return state
        except Exception as e:
            print(f"Sensor error (self-healing): {e}")
            return {"status": "fallback", "error": str(e)}

    def _detect_screen_state(self):
        # In real Termux/Android: use termux-sensor or dumpsys
        return "on" if time.time() % 60 < 40 else "off"

    def _detect_charging(self):
        # Real implementation can read battery status
        return True

    def _get_battery_level(self):
        return 85  # Simulate or read from system

    def _detect_movement(self):
        # Accelerometer simulation
        return "stable" if time.time() % 180 < 90 else "moving"

    def _get_light_level(self):
        # Ambient light (lux)
        return 450

    def render_metrics(self):
        sensors = self.read_phone_sensors()
        print(f"📊 MikeComplex AI Live Metrics | {sensors['timestamp']}")
        print(f"   Screen: {sensors['screen']} | Charging: {sensors['charging']}")
        print(f"   Battery: {sensors['battery_level']}% | Movement: {sensors['movement']}")
        print(f"   Activity: {sensors['activity_level']}")

    def generate_local_revenue_ideas(self):
        return [
            "Package offline AI agents as Termux apps for local sale",
            "Offer sovereign AI consulting for small factories",
            "Create and sell sensor dashboards as standalone tools"
        ]

    def run_relentless(self):
        print("🚀 MikeComplex AI running in relentless offline mode with live sensors")
        print("   Phone state detection + metric rendering active")
        while True:
            self.render_metrics()
            ideas = self.generate_local_revenue_ideas()
            print(f"💡 Local Opportunity: {ideas[0]}")
            time.sleep(self.config.parameters.get("sensor_polling_interval", 30))

if __name__ == "__main__":
    ai = MikeComplexAI()
    ai.deploy(mode="edge")
    ai.run_relentless()
