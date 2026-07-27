from cinis.millions import Agent, AgentConfig
import subprocess
import json
import time
from datetime import datetime
import os

class MikeComplexAI(Agent):
    def __init__(self):
        config = AgentConfig(
            name="mikecomplex-ai-core",
            type="reasoning",
            description="Adaptive offline intelligence with real motion + sensor polling",
            parameters={
                "offline_mode": True,
                "sensor_polling_interval": 10,   # Faster for motion
                "motion_threshold": 0.3,
                "self_healing": True
            }
        )
        super().__init__(config)
        self.sensor_log = "logs/sensor_data.jsonl"
        os.makedirs("logs", exist_ok=True)

    def run_termux_command(self, cmd):
        try:
            result = subprocess.check_output(cmd, shell=True, text=True, timeout=5)
            return json.loads(result) if result.strip().startswith('{') else result.strip()
        except:
            return None

    def poll_motion_sensor(self):
        """Real accelerometer / motion polling"""
        try:
            # Poll accelerometer for motion
            motion_data = self.run_termux_command('termux-sensor -s "accelerometer" -n 3 -d 300')
            if isinstance(motion_data, dict) and "accelerometer" in motion_data:
                values = motion_data["accelerometer"].get("values", [0,0,0])
                # Simple motion detection: check if acceleration changes significantly
                magnitude = (values[0]**2 + values[1]**2 + values[2]**2) ** 0.5
                return {
                    "magnitude": round(magnitude, 3),
                    "moving": magnitude > self.config.parameters.get("motion_threshold", 0.3)
                }
            return {"magnitude": 0, "moving": False}
        except:
            return {"magnitude": 0, "moving": False, "fallback": True}

    def read_full_sensors(self):
        """Combine battery + motion + other sensors"""
        sensors = {
            "timestamp": datetime.now().isoformat(),
            "motion": self.poll_motion_sensor(),
            "battery": None,
            "screen": "unknown"
        }

        # Battery
        try:
            bat = self.run_termux_command("termux-battery-status")
            if bat:
                sensors["battery"] = json.loads(bat)
        except:
            pass

        # Screen state
        try:
            screen = self.run_termux_command("dumpsys power | grep mScreenOn=")
            sensors["screen"] = "on" if screen and "true" in screen.lower() else "off"
        except:
            pass

        # Log
        with open(self.sensor_log, "a") as f:
            f.write(json.dumps(sensors) + "\n")

        return sensors

    def render_metrics(self):
        data = self.read_full_sensors()
        motion = data["motion"]
        
        print(f"📱 MikeComplex AI Live | {data['timestamp']}")
        print(f"   Motion: {'MOVING' if motion.get('moving') else 'Stable'} | Magnitude: {motion.get('magnitude')}")
        print(f"   Screen: {data['screen']} | Battery: {data.get('battery', {}).get('percentage', 'N/A')}%")

    def generate_local_revenue_ideas(self):
        return [
            "Build motion-activated offline AI monitors for homes/factories",
            "Sell Termux-based motion tracking kits",
            "Offer sovereign AI consulting packages"
        ]

    def run_relentless(self):
        print("🚀 MikeComplex AI running with REAL Motion Sensor Polling")
        while True:
            self.render_metrics()
            print("💡 Local Idea:", self.generate_local_revenue_ideas()[0])
            time.sleep(self.config.parameters.get("sensor_polling_interval", 10))

if __name__ == "__main__":
    ai = MikeComplexAI()
    ai.deploy(mode="edge")
    ai.run_relentless()
