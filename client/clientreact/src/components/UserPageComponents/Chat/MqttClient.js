import * as mqtt from "mqtt/dist/mqtt";

export const clientId = "mqttjs_" + Math.random().toString(16);

const host = "ws://127.0.0.1:8000/mqtt";
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    id: clientId,
    retain: false,
  },
};
export const client = mqtt.connect(host, options);
