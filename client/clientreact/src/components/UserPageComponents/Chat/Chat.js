import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
//mqtt
import mqtt from "mqtt/dist/mqt";

const Chat = ({ id }) => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3003");
    socket.on("new comment", (data) => {
      setResponse([...response, data]);
    });
    // return () => socket.disconnect();
  }, [response]);

  const handleClick = () => {
    const socket = socketIOClient("http://localhost:3003");
    //emit comment to server with socket id
    // socket.to("ID").emit("new comment", "data");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const socket = socketIOClient("http://localhost:3003");
    //emit comment to server with socket id that equals 5
    socket.to("5").emit("new comment", "data");
  };

  const [input, setInput] = useState("");

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <div className=" bg-slate-300   h-72 mx-10">
        <button onClick={handleClick}>Send new comment</button>
        <form onSubmit={handleSubmit}>
          <input type="text" name="comment" onChange={handleInput} />
          <button>
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chat;
