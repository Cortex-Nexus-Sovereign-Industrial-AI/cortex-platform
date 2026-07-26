cat << 'EOF' > webhook.py
import http.server
import socketserver
import json

PORT = 3000

class WebhookHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "ONLINE", "message": "Sovereign Node Active"}
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        print("\n--- INCOMING WEBHOOK PAYLOAD ---")
        print(post_data.decode('utf-8'))
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "SUCCESS", "message": "Payload Received"}
        self.wfile.write(json.dumps(response).encode())

print(f"Starting server on port {PORT}...")
with socketserver.TCPServer(("", PORT), WebhookHandler) as httpd:
    httpd.serve_forever()
EOF
