<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MikeComplex AI • Live Sensor Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; background: #0f0f0f; color: #0f0; margin: 0; padding: 20px; }
        h1 { color: #0f0; text-align: center; }
        .card { background: #1a1a1a; border: 1px solid #0f0; border-radius: 8px; padding: 15px; margin: 15px 0; }
        canvas { max-width: 100%; height: 220px !important; }
        #status { font-weight: bold; padding: 8px; border-radius: 4px; }
        .connected { background: #003300; color: #0f0; }
        .disconnected { background: #330000; color: #ff6666; }
        #log { height: 180px; overflow-y: auto; background: #111; padding: 10px; font-family: monospace; font-size: 0.85em; }
        button { background: #0f0; color: #000; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🚀 MikeComplex AI • Live Sensors (WebSocket)</h1>
    <div id="status" class="disconnected">🔴 Disconnected — Waiting to connect...</div>

    <div class="card">
        <h2>Motion Magnitude Over Time</h2>
        <canvas id="motionChart"></canvas>
    </div>

    <div class="card">
        <h2>Battery Level Over Time</h2>
        <canvas id="batteryChart"></canvas>
    </div>

    <div class="card">
        <h2>Recent Raw Sensor Log</h2>
        <pre id="log"></pre>
    </div>

    <script>
        let motionData = [];
        let batteryData = [];
        let labels = [];
        let ws = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 10;

        const motionCtx = document.getElementById('motionChart').getContext('2d');
        const batteryCtx = document.getElementById('batteryChart').getContext('2d');

        const motionChart = new Chart(motionCtx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Motion Magnitude', borderColor: '#0f0', data: motionData, tension: 0.4 }] },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const batteryChart = new Chart(batteryCtx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Battery %', borderColor: '#ff0', data: batteryData, tension: 0.4 }] },
            options: { scales: { y: { min: 0, max: 100 } } }
        });

        function updateStatus(connected) {
            const statusEl = document.getElementById('status');
            if (connected) {
                statusEl.className = 'connected';
                statusEl.textContent = '🟢 Connected to real-time sensor feed';
                reconnectAttempts = 0;
            } else {
                statusEl.className = 'disconnected';
                statusEl.textContent = `🔴 Disconnected — Attempt ${reconnectAttempts}/${maxReconnectAttempts}`;
            }
        }

        function connectWebSocket() {
            if (ws && ws.readyState === WebSocket.OPEN) return;

            ws = new WebSocket('ws://localhost:8080/ws');

            ws.onopen = () => {
                updateStatus(true);
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const time = new Date(data.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

                    labels.push(time);
                    motionData.push(data.motion ? data.motion.magnitude || 0 : 0);
                    batteryData.push(data.battery ? data.battery.percentage || 0 : 0);

                    if (labels.length > 30) {
                        labels.shift();
                        motionData.shift();
                        batteryData.shift();
                    }

                    motionChart.update();
                    batteryChart.update();

                    document.getElementById('log').textContent += JSON.stringify(data, null, 2) + '\n\n';
                    document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
                } catch (e) {
                    console.error("Parse error:", e);
                }
            };

            ws.onclose = () => {
                updateStatus(false);
                console.log('WebSocket closed');
                attemptReconnect();
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                updateStatus(false);
            };
        }

        function attemptReconnect() {
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                console.log(`Reconnecting... attempt ${reconnectAttempts}`);
                setTimeout(connectWebSocket, 3000);
            } else {
                document.getElementById('status').innerHTML = 
                    `🔴 Max reconnect attempts reached. <button onclick="reconnectAttempts=0;connectWebSocket()">Retry Manually</button>`;
            }
        }

        // Start connection
        connectWebSocket();

        // Fallback manual refresh button
        setTimeout(() => {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                document.getElementById('status').innerHTML += ' <button onclick="connectWebSocket()">Force Reconnect</button>';
            }
        }, 10000);
    </script>
</body>
</html>
