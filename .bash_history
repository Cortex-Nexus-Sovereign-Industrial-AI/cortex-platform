            <p><strong>System:</strong> Active | <strong>Port:</strong> 3000</p>
            <p><strong>B2B Webhook Ingress:</strong> <code>/api/b2b/revenue</code></p>
        </div>
    </body>
    </html>
    """
    return html_content

# API Routes
@app.post("/api/b2b/revenue")
async def record_b2b_revenue(payload: B2BRevenuePayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(log_revenue, payload)
    return {"status": "SUCCESS", "message": "Transaction Logged to Sovereign Ledger", "transaction_id": payload.transaction_id}

@app.get("/api/b2b/analytics")
def get_analytics():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT source, client_type, amount, timestamp FROM revenue_ledger ORDER BY id DESC LIMIT 20")
    revenues = cursor.fetchall()
    
    cursor.execute("SELECT ip_address, path, timestamp FROM traffic_analytics ORDER BY id DESC LIMIT 20")
    traffic = cursor.fetchall()
    conn.close()
    
    return {
        "revenue_records": revenues,
        "recent_traffic": traffic
    }

if __name__ == "__main__":
    import uvicorn
    print("Launching Sovereign Enterprise Engine on Port 3000...")
    uvicorn.run(app, host="0.0.0.0", port=3000)
EOF

pip install fastapi uvicorn pydantic
python enterprise_engine.py
{"status":"SUCCESS","message":"Transaction Logged to Sovereign Ledger","transaction_id":"B2B-8809"}
python zero_engine.py
# 1. Install dependencies
pip install fastapi uvicorn sqlite3 pydantic requests
python engine.py
cat << 'EOF' > engine.py
import sqlite3
import time
import json
import asyncio
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, Request, Header
from pydantic import BaseModel

# Initialize App & Database
app = FastAPI(title="Sovereign Enterprise Engine", version="1.0")
DB_FILE = "sovereign_core.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Revenue & Transactions Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS revenue_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            transaction_id TEXT UNIQUE,
            amount REAL,
            timestamp TEXT
        )
    ''')
    # Operational Telemetry & Keystroke Accounting
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keystrokes INTEGER,
            tokens_generated REAL,
            energy_index_joules REAL,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Models
class RevenuePayload(BaseModel):
    source: str
    transaction_id: str
    amount: float

class TelemetryPayload(BaseModel):
    keystrokes: int

# Background Logger Tasks
def record_revenue_task(payload: RevenuePayload):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        cursor.execute(
            "INSERT INTO revenue_ledger (source, transaction_id, amount, timestamp) VALUES (?, ?, ?, ?)",
            (payload.source, payload.transaction_id, payload.amount, timestamp)
        )
        conn.commit()
        print(f"\n[REVENUE LOGGED] ${payload.amount} from {payload.source} (ID: {payload.transaction_id})")
    except sqlite3.IntegrityError:
        print(f"\n[REVENUE SKIPPED] Transaction {payload.transaction_id} already exists.")
    finally:
        conn.close()

def record_telemetry_task(keystrokes: int):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    tokens = keystrokes * 1.33
    joules = keystrokes * 0.002
    cursor.execute(
        "INSERT INTO system_telemetry (keystrokes, tokens_generated, energy_index_joules, timestamp) VALUES (?, ?, ?, ?)",
        (keystrokes, tokens, joules, timestamp)
    )
    conn.commit()
    conn.close()
    print(f"[TELEMETRY LOGGED] {keystrokes} keystrokes -> {tokens:.2f} tokens | Energy: {joules:.4f}J")

# API Routes
@app.get("/")
def read_root():
    return {"status": "ONLINE", "node": "Sovereign_Local_Core", "port": 3000}

@app.post("/api/webhook")
async def handle_webhook(payload: RevenuePayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(record_revenue_task, payload)
    return {"status": "ACCEPTED", "transaction_id": payload.transaction_id}

@app.post("/api/telemetry")
async def handle_telemetry(payload: TelemetryPayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(record_telemetry_task, payload.keystrokes)
    return {"status": "LOGGED", "keystrokes": payload.keystrokes}

@app.get("/api/ledger")
def get_ledger():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT source, transaction_id, amount, timestamp FROM revenue_ledger ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return {"total_records": len(rows), "data": rows}

if __name__ == "__main__":
    import uvicorn
    print("Starting Sovereign Core Engine on Port 3000...")
    uvicorn.run(app, host="0.0.0.0", port=3000)
EOF

python engine.py
autossh -M 0 -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -R cinisnio:80:localhost:3000 serveo.net
ping -c 3 cinisnio.ai
curl -I https://cinisnio.ai -k
curl -X POST https://cinisnio.ai/api/webhook   -H "Content-Type: application/json"   -d '{
    "source": "Manual_Pipeline_Test",
    "transaction_id": "TEST-9999",
    "amount": 250.00
  }' -k
clear
pkg update && pkg install nodejs -y
lt --port 3000
pkg install cloudflared -y
cloudflared tunnel --url http://localhost:3000
clear
ssh -R 80:localhost:3000 serveo.net
ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net
claer
ckear
clear
cat << 'EOF' > zero_engine.py
import sqlite3
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

DB_FILE = "sovereign_enterprise.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS revenue_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            client_type TEXT,
            transaction_id TEXT UNIQUE,
            amount REAL,
            timestamp TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS traffic_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            user_agent TEXT,
            path TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class SovereignRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self):
        client_ip = self.client_address[0]
        user_agent = self.headers.get("User-Agent", "Unknown")
        
        # Log traffic
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO traffic_analytics (ip_address, user_agent, path, timestamp) VALUES (?, ?, ?, ?)",
            (client_ip, user_agent, self.path, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        )
        conn.commit()

        if self.path == "/" or self.path == "":
            cursor.execute("SELECT SUM(amount) FROM revenue_ledger")
            total_rev = cursor.fetchone()[0] or 0.0
            cursor.execute("SELECT COUNT(*) FROM traffic_analytics")
            total_hits = cursor.fetchone()[0]
            conn.close()

            html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Sovereign Node Core</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {{ font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 20px; }}
        .card {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin-bottom: 20px; }}
        h1 {{ color: #58a6ff; }}
        .metric {{ font-size: 2em; color: #3fb950; font-weight: bold; }}
    </style>
</head>
<body>
    <h1>Sovereign Enterprise Engine</h1>
    <div class="card"><div>TOTAL REVENUE</div><div class="metric">${total_rev:,.2f}</div></div>
    <div class="card"><div>TOTAL INGRESS HITS</div><div class="metric">{total_hits}</div></div>
</body>
</html>"""
            self._set_headers(200, "text/html")
            self.wfile.write(html.encode("utf-8"))
        
        elif self.path == "/api/b2b/analytics":
            cursor.execute("SELECT source, client_type, amount, timestamp FROM revenue_ledger ORDER BY id DESC LIMIT 20")
            revenues = cursor.fetchall()
            conn.close()
            self._set_headers(200)
            self.wfile.write(json.dumps({"revenue_records": revenues}).encode("utf-8"))
        else:
            conn.close()
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

    def do_POST(self):
        if self.path == "/api/b2b/revenue":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode("utf-8"))
                source = data.get("source", "Unknown")
                client_type = data.get("client_type", "Standard")
                transaction_id = data.get("transaction_id", f"TX-{int(datetime.now().timestamp())}")
                amount = float(data.get("amount", 0.0))

                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO revenue_ledger (source, client_type, transaction_id, amount, timestamp) VALUES (?, ?, ?, ?, ?)",
                    (source, client_type, transaction_id, amount, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                )
                conn.commit()
                conn.close()

                self._set_headers(200)
                response = {"status": "SUCCESS", "message": "Transaction Logged", "transaction_id": transaction_id}
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"status": "ERROR", "message": str(e)}).encode("utf-8"))

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 3000), SovereignRequestHandler)
    print("Launching Zero-Dependency Sovereign Engine on Port 3000...")
    server.serve_forever()
EOF

python zero_engine.py
curl -X POST http://localhost:3000/api/b2b/revenue   -H "Content-Type: application/json"   -d '{
    "source": "Affiliate_Partner_Nexus",
    "client_type": "B2B_Enterprise",
    "transaction_id": "B2B-8809",
    "amount": 2500.00
  }'
{"status": "SUCCESS", "message": "Transaction Logged", "transaction_id": "B2B-8809"}
cat << 'EOF' > node_daemon.sh
#!/bin/bash

# Sovereign Local Node Supervisor
LOG_FILE="daemon.log"

echo "=========================================" >> $LOG_FILE
echo "[$(date)] Starting Sovereign Process Supervisor..." >> $LOG_FILE

while true
do
    # Check if zero_engine.py is actively running
    if ! pgrep -f "zero_engine.py" > /dev/null
    then
        echo "[$(date)] [ALERT] Engine offline. Booting zero_engine.py..." >> $LOG_FILE
        nohup python zero_engine.py >> engine_runtime.log 2>&1 &
    fi

    # Check if autossh tunnel is active
    if ! pgrep -f "autossh" > /dev/null
    then
        echo "[$(date)] [ALERT] Tunnel offline. Re-establishing autossh gateway..." >> $LOG_FILE
        nohup autossh -M 0 -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -R cinisnio:80:localhost:3000 serveo.net >> tunnel_runtime.log 2>&1 &
    fi

    # Wait 30 seconds before next heartbeat check
    sleep 30
done
EOF

chmod +x node_daemon.sh
nohup ./node_daemon.sh > /dev/null 2>&1 &
ps aux | grep -E "python|autossh"
cat << 'EOF' > hardened_engine.py
import sqlite3
import json
import hmac
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

DB_FILE = "sovereign_enterprise.db"
# System Secret Key — Used to verify incoming payloads
SOVEREIGN_SECRET = b"CINIS_SOVEREIGN_KEY_2026"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS revenue_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            client_type TEXT,
            transaction_id TEXT UNIQUE,
            amount REAL,
            timestamp TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS traffic_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            user_agent TEXT,
            path TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class HardenedRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def verify_signature(self, raw_body, signature_header):
        if not signature_header:
            return False
        expected_sig = hmac.new(SOVEREIGN_SECRET, raw_body, hashlib.sha256).hexdigest()
        # Constant time comparison to prevent timing attacks
        return hmac.compare_digest(expected_sig, signature_header)

    def do_GET(self):
        client_ip = self.client_address[0]
        user_agent = self.headers.get("User-Agent", "Unknown")
        
        # Log traffic ingress
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO traffic_analytics (ip_address, user_agent, path, timestamp) VALUES (?, ?, ?, ?)",
            (client_ip, user_agent, self.path, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        )
        conn.commit()

        if self.path == "/" or self.path == "":
            cursor.execute("SELECT SUM(amount) FROM revenue_ledger")
            total_rev = cursor.fetchone()[0] or 0.0
            cursor.execute("SELECT COUNT(*) FROM traffic_analytics")
            total_hits = cursor.fetchone()[0]
            conn.close()

            html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Sovereign Node Core</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {{ font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 20px; }}
        .card {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin-bottom: 20px; }}
        h1 {{ color: #58a6ff; }}
        .metric {{ font-size: 2em; color: #3fb950; font-weight: bold; }}
    </style>
</head>
<body>
    <h1>Sovereign Hardened Engine</h1>
    <div class="card"><div>TOTAL AUTHENTICATED REVENUE</div><div class="metric">${total_rev:,.2f}</div></div>
    <div class="card"><div>TOTAL INGRESS TRAFFIC</div><div class="metric">{total_hits} Requests</div></div>
</body>
</html>"""
            self._set_headers(200, "text/html")
            self.wfile.write(html.encode("utf-8"))
        else:
            conn.close()
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode("utf-8"))

    def do_POST(self):
        if self.path == "/api/b2b/revenue":
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length)
            provided_signature = self.headers.get("X-Sovereign-Signature", "")

            # Cryptographic Gatekeeping Check
            if not self.verify_signature(raw_body, provided_signature):
                self._set_headers(401)
                self.wfile.write(json.dumps({"status": "REJECTED", "reason": "Invalid or Missing HMAC Signature"}).encode("utf-8"))
                return

            try:
                data = json.loads(raw_body.decode("utf-8"))
                source = data.get("source", "Unknown")
                client_type = data.get("client_type", "Standard")
                transaction_id = data.get("transaction_id", f"TX-{int(datetime.now().timestamp())}")
                amount = float(data.get("amount", 0.0))

                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO revenue_ledger (source, client_type, transaction_id, amount, timestamp) VALUES (?, ?, ?, ?, ?)",
                    (source, client_type, transaction_id, amount, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                )
                conn.commit()
                conn.close()

                self._set_headers(200)
                response = {"status": "SUCCESS", "message": "Authenticated Payload Recorded", "transaction_id": transaction_id}
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"status": "ERROR", "message": str(e)}).encode("utf-8"))

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 3000), HardenedRequestHandler)
    print("Sovereign Engine active on Port 3000 [HMAC Enforcement Active]")
    server.serve_forever()
EOF

python hardened_engine.py
curl -X POST http://localhost:3000/api/b2b/revenue   -H "Content-Type: application/json"   -d '{"source": "Unauthorized_Actor", "amount": 9999}'
curl -X POST http://localhost:3000/api/b2b/revenue   -H "Content-Type: application/json"   -d '{"source": "Unauthorized_Actor", "amount": 9999}'
python -c '
import hmac, hashlib, requests

url = "http://localhost:3000/api/b2b/revenue"
secret = b"CINIS_SOVEREIGN_KEY_2026"
payload = {"source": "Sovereign_B2B_Partner", "client_type": "Enterprise", "transaction_id": "SECURE-9001", "amount": 5000.00}
raw_data = str(payload).replace("\'", "\"").encode("utf-8")

sig = hmac.new(secret, raw_data, hashlib.sha256).hexdigest()
headers = {"Content-Type": "application/json", "X-Sovereign-Signature": sig}

res = requests.post(url, data=raw_data, headers=headers)
print(res.json())
'

