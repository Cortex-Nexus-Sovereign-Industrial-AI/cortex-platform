from flask import Flask
from flask_sock import Sock
import json
import time

app = Flask(__name__)
sock = Sock(app)

@sock.route('/ws')
def sensor_ws(ws):
    print("Client connected to real-time sensor feed")
    while True:
        try:
            # Read latest sensor data
            with open('logs/sensor_data.jsonl', 'r') as f:
                lines = f.readlines()
                if lines:
                    latest = json.loads(lines[-1])
                    ws.send(json.dumps(latest))
            time.sleep(5)  # Push every 5 seconds
        except:
            time.sleep(5)

if __name__ == '__main__':
    app.run(port=8080, debug=True)
