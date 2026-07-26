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
