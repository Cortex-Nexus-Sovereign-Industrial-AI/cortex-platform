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
