import React, { useMemo } from "react";

export default function MessageList({ messages, username }) {
  const messageslist = useMemo(() => {
    return messages.map((message, index) => (
      <div key={index} className="m-2">
        {message.username === username && (
          <div className=" flex justify-end ">
            <div className="flex flex-col  ">
              <div className="  bg-green  text-slate-100 rounded-lg p-2 m-1   break-all">
                {message.message}
              </div>
              <span className="text-xs text-gray-400">{message.username}</span>
            </div>
          </div>
        )}
        {message.username !== username && (
          <div className="flex flex-col w-min">
            <div className="  bg-slate-100  text-slate-900 rounded-lg p-2 m-2 ">
              {message.message}
              {console.log("message", message)}
            </div>
            <span className="text-xs text-gray-400">{message.username}</span>
          </div>
        )}
      </div>
    ));
  }, [messages, username]);
  return <div>{messageslist}</div>;
}
