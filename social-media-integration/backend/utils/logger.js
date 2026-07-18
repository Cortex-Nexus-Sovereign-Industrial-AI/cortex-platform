"use strict";

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'app.log');

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] INFO: ${message}\n`;
    console.log(log);
    fs.appendFileSync(logFile, log);
  },
  error: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ERROR: ${message}\n${JSON.stringify(meta)}\n`;
    console.error(log);
    fs.appendFileSync(logFile, log);
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] WARN: ${message}\n`;
    console.warn(log);
    fs.appendFileSync(logFile, log);
  }
};

module.exports = logger;
