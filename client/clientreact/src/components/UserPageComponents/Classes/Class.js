export default function Class({ obj }) {
  return (
    <div className="Class">
      {obj.image && <img src={obj.image} alt="img" />}
      <h1>{obj.name}</h1>
      <div className="important_info">
        <h3>{obj.place}</h3>
        <h3>{obj.time}</h3>
      </div>
      <p>{obj.description}</p>
    </div>
  );
}
