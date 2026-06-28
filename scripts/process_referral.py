import os
import sys
import json

def run_postback_sync():
    event_payload_path = os.getenv('GITHUB_EVENT_PATH')
    
    if not event_payload_path:
        print("Error: No event payload found.")
        sys.exit(1)
        
    with open(event_payload_path, 'r') as f:
        event_data = json.load(f)
        
    client_payload = event_data.get('client_payload', {})
    click_id = client_payload.get('click_id', 'Unknown_ID')
    campaign = client_payload.get('campaign', 'Unknown_Campaign')
    
    print(f"--- CORTEX CORE SYSTEM LOG ---")
    print(f"Successfully captured referral event!")
    print(f"Tracking ID (Visitor.sub_id): {click_id}")
    print(f"Campaign: {campaign}")
    print(f"--------------------------------")

if __name__ == "__main__":
    run_postback_sync()
  
