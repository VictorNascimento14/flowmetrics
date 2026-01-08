from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        data = {
            "status": "online",
            "language": "python",
            "message": "Services Operational",
            "timestamp": datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(data).encode('utf-8'))
        return
