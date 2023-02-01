import React, { useState, useEffect } from "react";
import { client } from "./Chat/MqttClient";
export default function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    client.subscribe("/time", { qos: 0 });
    client.on("message", (topic, message) => {
      if (topic === "/time") {
        //get 2 last digits
        const b = message.toString().slice(-2);
        //get rest
        const a = message.toString().slice(0, -2);

        setTime([a, b]);
      }
    });

    return () => {};
  }, []);

  return (
    <div
      className="  h-min w-90 mx-auto flex flex-col  w-max  text-pink-600 my-10"
      id="timer"
    >
      {/* <img /> */}
      <div className="text">
        <h2>Nie czekaj zapisz sie juz dziś</h2>
        <h2>Cenny czas mija</h2>
        <h2 className="text-center">
          <span>{time[0]}</span>
          <span>{time[1]}</span>
        </h2>
      </div>
    </div>
  );
}
