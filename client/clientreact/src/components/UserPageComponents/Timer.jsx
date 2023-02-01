import React, { useState, useEffect } from "react";
import { client } from "./Chat/MqttClient";
export default function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    client.on("message", (topic, message) => {
      if (topic === "timer") {
        setTime(message.toString());
      }
    });

    return () => {
      client.off("message");
    };
  }, []);

  return (
    <div>
      <h1>Timer</h1>
      //<h2>{time}</h2>
    </div>
  );
}
