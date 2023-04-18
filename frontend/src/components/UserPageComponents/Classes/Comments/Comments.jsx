import React, { useEffect, useState } from "react";
import * as mqtt from "mqtt/dist/mqtt";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useId } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommentsList from "./CommentsList";

export const schema = yup.object().shape({
  message: yup.string().required("message is required"),
});

const Comments = ({ id }) => {
  const [messagess, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const username = useSelector((state) => state.auth.username);
  const [connected, setConnected] = useState(false);

  const clientId = "mqttjs_" + Math.random().toString(16);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const client = mqtt.connect(host, options);

  const cookies = new Cookies();
  const token = cookies.get("token").accessToken;

  useEffect(() => {
    fetch(`http://localhost:3003/comments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const mess = data.map((msg) => {
          return { message: msg.message, id: msg.id };
        });
        setMessages(mess);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const commentid = useId();

  const sendMessage = (data) => {
    const message = data.message;

    const me = JSON.stringify({
      username: username,
      message: message,
      id: commentid,
    });
    client.publish(`/comments/${id}`, me);
    console.log(me);

    reset();
    setMessage("");
  };
  useEffect(() => {
    client.on("connect", function () {
      setConnected(true);
      client.subscribe(`/comments/${id}`);
    });
    return () => {
      client.unsubscribe(`/comments/${id}`);
      client.removeListener("connect", () => {});
    };
  }, []);

  client.on("message", function (topic, message) {
    const msg = JSON.parse(message.toString());

    setMessages((prev) => [...prev, msg]);
  });

  useEffect(() => {
    const chat = document.getElementById("chat");
    if (chat) {
      chat.scrollTo(0, chat.scrollHeight);
    }
    return () => {};
  }, [messagess]);

  const comments = (
    <div className="  p-4  mx-autorounded-3xl bg-opacity-50">
      <div
        id="chat"
        className=" overflow-scroll  h-80 p-3 m-0 border-spacing-4  bg-slate-200 background-opacity-20"
      >
        <CommentsList comments={messagess} username={username} id={id} />
      </div>
      <form
        onSubmit={handleSubmit(sendMessage)}
        id="message"
        className="my-2 flex flex-row "
      >
        <input
          type="text"
          className="border-2 border-gray-300 bg-white  px-5 py-1 pr-16 rounded-lg text-sm focus:outline-none w-full"
          placeholder="Type your message"
          {...register("message")}
        />

        <button type="submit" className="w-min">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            className="w-6 h-6 text-gray-400 hover:text-gray-500"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </form>
      {errors.message && (
        <p className="text-red-500 text-xs italic">
          Nie możesz opublikować pustego komentarza
        </p>
      )}
    </div>
  );

  return <>{comments}</>;
};

export default Comments;
