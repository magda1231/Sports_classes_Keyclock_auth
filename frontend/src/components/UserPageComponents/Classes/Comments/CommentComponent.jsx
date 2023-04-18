export default function CommentComponent({ message, username, id }) {
  return (
    <>
      {message.username === username && (
        <div className=" flex justify-end ">
          <div className="flex flex-row  ">
            <div className="  bg-green  text-slate-100 rounded-lg p-2 m-1   break-all">
              {message.message}
            </div>
          </div>
        </div>
      )}
      {message.username !== username && (
        <div className="flex flex-row w-min   items-center">
          <div className="  bg-slate-100  text-slate-900 rounded-lg p-2 m-2 ">
            {message.message}
          </div>

          {/* <span className="text-xs text-gray-400">{message.username}</span> */}
        </div>
      )}
    </>
  );
}
