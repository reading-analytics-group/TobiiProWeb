import WebSocket from 'isomorphic-ws'
import jsLogger, { ILogger } from 'js-logger'
import { waitForSocketState } from './utils'

// Create logger
jsLogger.useDefaults()
const tobiiLogger: ILogger = jsLogger.get('tobiiprosdk')

export default class TobiiClient {
  port: number

  constructor(port: number = 3000) {
    this.port = port
  }

  async getTest() {
    const response = await fetch(`http://localhost:${this.port}/api/test`);
    const data = await response.json();
    return data;
  }

  async getEyeTrackers() {
    const response = await fetch(`http://localhost:${this.port}/find`);
    const data = await response.json();
    return data;
  }

  async createWebSocketConnection() {
    const ws: WebSocket = new WebSocket(`ws://localhost:${this.port}`);
    await waitForSocketState(ws, ws.OPEN);
  
    ws.onopen = function() {
      console.log('WebSocket connection established');
      ws.send('Hello Server!');
    };
  
    ws.onmessage = function(event) {
      console.log(`Message from server: ${event.data}`);
    };
  
    return ws;
  }
}