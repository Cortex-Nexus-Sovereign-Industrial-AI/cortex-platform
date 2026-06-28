# INDEX.HTML VOICE APP INTEGRATION CODE

## 1. ADD TO <HEAD> SECTION (after existing meta tags)

```html
<!-- Voice Intelligence Layer -->
<meta name="voice-app" content="CINIS NEXUS Voice Intelligence Layer v1.0">
<script async src="https://cdn.jsdelivr.net/npm/web-speech-api@0.0.3/lib/main.js"></script>
```

---

## 2. ADD VOICE WIDGET TO HERO SECTION (after main CTA button)

```html
<div class="voice-widget">
  <button id="voiceToggle" class="voice-btn" title="Click to use voice">
    <span class="voice-icon">🎤</span>
    <span class="voice-text">Speak to CINIS</span>
  </button>
  <div id="voiceTranscript" class="voice-transcript" style="display:none;">
    <p id="voiceText"></p>
    <button id="voiceClose" class="voice-close">×</button>
  </div>
  <div id="voiceResponse" class="voice-response" style="display:none;">
    <p id="responseText"></p>
  </div>
</div>
```

---

## 3. ADD CSS STYLING (in <style> section, before closing </style>)

```css
/* Voice Widget Styles */
.voice-widget {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.voice-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00C2FF 0%, #001F5B 100%);
  border: 3px solid #D4A017;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 194, 255, 0.3);
  transition: all 0.3s ease;
}

.voice-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 24px rgba(0, 194, 255, 0.5);
}

.voice-btn:active {
  transform: scale(0.95);
}

.voice-icon {
  font-size: 32px;
  display: block;
}

.voice-text {
  font-size: 8px;
  text-align: center;
  margin-top: 2px;
}

.voice-transcript {
  position: fixed;
  bottom: 120px;
  right: 30px;
  background: #001F5B;
  border: 2px solid #00C2FF;
  border-radius: 8px;
  padding: 15px;
  max-width: 300px;
  color: #00C2FF;
  font-family: Segoe UI, sans-serif;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.voice-transcript p {
  margin: 0;
  line-height: 1.5;
}

.voice-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #D4A017;
  border: none;
  color: #001F5B;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-response {
  position: fixed;
  bottom: 120px;
  right: 30px;
  background: #00FF88;
  border-radius: 8px;
  padding: 15px;
  max-width: 300px;
  color: #001F5B;
  font-family: Segoe UI, sans-serif;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
}

.voice-response p {
  margin: 0;
  line-height: 1.5;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .voice-widget {
    bottom: 20px;
    right: 20px;
  }

  .voice-btn {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .voice-icon {
    font-size: 28px;
  }

  .voice-transcript,
  .voice-response {
    bottom: 100px;
    right: 20px;
    max-width: 250px;
  }
}
```

---

## 4. ADD VOICE LOGIC (before closing </body> tag)

```html
<script>
// Voice Intelligence Layer - CINIS NEXUS
class VoiceIntelligence {
  constructor() {
    this.isListening = false;
    this.recognition = this.initSpeechRecognition();
    this.voices = {};
    this.initVoiceWidget();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-NG';
    
    recognition.onstart = () => {
      this.isListening = true;
      document.getElementById('voiceToggle').style.background = 'linear-gradient(135deg, #00FF88 0%, #00C2FF 100%)';
      this.showTranscript('Listening...');
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      document.getElementById('voiceText').textContent = transcript;
      
      if (event.results[event.results.length - 1].isFinal) {
        this.processVoiceQuery(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      this.showResponse('Voice error: ' + event.error);
    };
    
    recognition.onend = () => {
      this.isListening = false;
      document.getElementById('voiceToggle').style.background = 'linear-gradient(135deg, #00C2FF 0%, #001F5B 100%)';
    };
    
    return recognition;
  }

  initVoiceWidget() {
    const toggleBtn = document.getElementById('voiceToggle');
    const closeBtn = document.getElementById('voiceClose');
    
    toggleBtn.addEventListener('click', () => this.toggleVoice());
    if (closeBtn) closeBtn.addEventListener('click', () => this.hideTranscript());
  }

  toggleVoice() {
    if (!this.recognition) {
      this.showResponse('Voice recognition not available in your browser');
      return;
    }
    
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  processVoiceQuery(transcript) {
    const query = transcript.toLowerCase().trim();
    
    // Voice Command Routes
    const commands = {
      'business directory': () => this.routeTo('#directory'),
      'show directory': () => this.routeTo('#directory'),
      'market prices': () => this.routeTo('#analytics'),
      'farming': () => this.routeTo('#education'),
      'subscribe': () => this.routeTo('#plans'),
      'contact': () => this.routeTo('#contact'),
      'help': () => this.showResponse('You can ask: business directory, market prices, farming info, subscribe, or contact us'),
      'hello': () => this.showResponse('Hello! I\'m CINIS NEXUS. How can I help you today?'),
      'what can you do': () => this.showResponse('I can show you the business directory, market intelligence, farming resources, subscription plans, and help you contact us. What would you like?'),
    };
    
    let matched = false;
    for (const [key, action] of Object.entries(commands)) {
      if (query.includes(key)) {
        action();
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      this.showResponse('I understood: "' + transcript + '". Try asking about directory, prices, farming, or subscribe.');
    }
  }

  routeTo(section) {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.showResponse('Navigating to ' + section.replace('#', '') + '...');
    } else {
      this.showResponse('Section not found');
    }
  }

  showTranscript(text) {
    const transcript = document.getElementById('voiceTranscript');
    document.getElementById('voiceText').textContent = text;
    transcript.style.display = 'block';
  }

  hideTranscript() {
    document.getElementById('voiceTranscript').style.display = 'none';
  }

  showResponse(text) {
    const response = document.getElementById('voiceResponse');
    document.getElementById('responseText').textContent = text;
    response.style.display = 'block';
    
    setTimeout(() => {
      response.style.display = 'none';
    }, 4000);
  }
}

// Initialize Voice Intelligence when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.voiceIntelligence = new VoiceIntelligence();
});
</script>
```

---

## 5. OPTIONAL: ADD VOICE SECTION TO PLATFORM FEATURES (in main content, after AI Chain section)

```html
<section id="voice-section">
  <div class="container">
    <h2>🎙️ Voice Intelligence Layer</h2>
    <p>Interact with CINIS NEXUS using your voice. Click the microphone button and speak naturally.</p>
    
    <div class="voice-commands">
      <h3>Try These Commands:</h3>
      <ul>
        <li>"Show me the business directory"</li>
        <li>"What are market prices?"</li>
        <li>"Find farming opportunities"</li>
        <li>"How do I subscribe?"</li>
        <li>"Contact support"</li>
      </ul>
    </div>
  </div>
</section>
```

---

## BROWSER COMPATIBILITY

✅ Chrome 25+  
✅ Edge 79+  
✅ Safari 14.1+  
✅ Firefox 50+ (with flag enabled)  
✅ Opera 27+  
⚠️ Mobile browsers (iOS Safari limited)

---

## TESTING

1. Open index.html in Chrome/Edge/Safari
2. Look for microphone button (🎤) in bottom-right corner
3. Click button and speak: "Show me the business directory"
4. Platform should scroll to #directory section
5. Try other commands listed above

---

## CUSTOMIZATION

### Change Voice Language
Line 43: `recognition.lang = 'en-NG';`
- Replace with: `'yo-NG'` for Yoruba
- Or: `'en-US'` for English US

### Change Button Position
Line in CSS: `bottom: 30px; right: 30px;`
- Adjust to your preference

### Change Response Timeout
Line 154: `setTimeout(() => { ... }, 4000);`
- Change 4000 to milliseconds (e.g., 6000 for 6 seconds)

### Add More Commands
Add to commands object (lines 81-92):
```javascript
'your phrase': () => this.routeTo('#section-id'),
```
