/**
 * Cortex Realtime Voice – Session & Turn State Machine
 * States: LISTENING → THINKING → SPEAKING → LISTENING
 */

const { v4: uuidv4 } = require('uuid');

class VoiceSession {
  constructor(sessionId = null) {
    this.id = sessionId || uuidv4();
    this.state = 'LISTENING';
    this.history = [];
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
  }

  setState(newState) {
    const valid = ['LISTENING', 'THINKING', 'SPEAKING'];
    if (!valid.includes(newState)) {
      throw new Error(`Invalid state: ${newState}`);
    }
    this.state = newState;
    this.lastActivity = Date.now();
    return this.state;
  }

  addTurn(role, content) {
    this.history.push({ role, content, ts: Date.now() });
    // Keep last N turns (from config)
    if (this.history.length > 40) {
      this.history = this.history.slice(-40);
    }
    this.lastActivity = Date.now();
  }

  canBargeIn() {
    return this.state === 'SPEAKING';
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state,
      historyLength: this.history.length,
      createdAt: this.createdAt,
      lastActivity: this.lastActivity
    };
  }
}

module.exports = { VoiceSession };
