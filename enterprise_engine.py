cat << 'EOF' > enterprise_engine.py
import sqlite3
import time
import json
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI(title="Sovereign Enterprise Engine", version="2.0")
DB_FILE = "sovereign_enterprise.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Revenue & Transactions Ledger
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
    # Traffic & Visitor Analytics
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS traffic_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            user_agent TEXT,
            path TEXT,
            timestamp TEXT
        )
    ''')
    # B2B & Telemetry Accounting
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS b2b_telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            partner_id TEXT,
            action TEXT,
            tokens_processed REAL,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Payload Models
class B2BRevenuePayload(BaseModel):
    source: str
    client_type: str  # B2B, Affiliate, Consumer
    transaction_id: str
    amount: float

class B2BTelemetryPayload(BaseModel):
    partner_id: str
    action: str
    data_volume: int

# Background Operations
def log_traffic(ip: str, user_agent: str, path: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO traffic_analytics (ip_address, user_agent, path, timestamp) VALUES (?, ?, ?, ?)",
        (ip, user_agent, path, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()

def log_revenue(payload: B2BRevenuePayload):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO revenue_ledger (source, client_type, transaction_id, amount, timestamp) VALUES (?, ?, ?, ?, ?)",
            (payload.source, payload.client_type, payload.transaction_id, payload.amount, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        )
        conn.commit()
    except sqlite3.IntegrityError:
        pass
    finally:
        conn.close()

# Middleware for Traffic Analytics
@app.middleware("http")
async def track_incoming_traffic(request: Request, call_next):
    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "Unknown")
    path = request.url.path
    
    # Run log in background
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO traffic_analytics (ip_address, user_agent, path, timestamp) VALUES (?, ?, ?, ?)",
        (client_ip, user_agent, path, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()
    
    response = await call_next(request)
    return response

# Public Web Interface (HTML Dashboard)
@app.get("/", response_class=HTMLResponse)
def public_dashboard():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) FROM revenue_ledger")
    total_rev = cursor.fetchone()[0] or 0.0
    
    cursor.execute("SELECT COUNT(*) FROM traffic_analytics")
    total_hits = cursor.fetchone()[0]
    conn.close()

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sovereign Node Core</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{ font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 20px; }}
            .card {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin-bottom: 20px; }}
            h1 {{ color: #58a6ff; }}
            .metric {{ font-size: 2em; color: #3fb950; font-weight: bold; }}
            .label {{ color: #8b949e; font-size: 0.9em; }}
        </style>
    </head>
    <body>
        <h1>Sovereign Enterprise Engine</h1>
        <div class="card">
            <div class="label">TOTAL LOGGED REVENUE</div>
            <div class="metric">${total_rev:,.2f}</div>
        </div>
        <div class="card">
            <div class="label">TOTAL TRAFFIC INGRESS HITS</div>
            <div class="metric">{total_hits} Requests</div>
        </div>
        <div class="card">
            <div class="label">NODE STATUS</div>
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
