import CommentComponent from "./CommentComponent";

export default function CommentsList({ comments, username, id }) {
  const commentslist = comments.map((message, index) => (
    <div key={index} className="m-4   h-90 bg-slate-200">
      <CommentComponent message={message} username={username} id={id} />
    </div>
  ));

  return <div>{commentslist}</div>;
}
