export default function Class({ obj }) {
  console.log(obj);
  return (
    <div className="Class">
      <h1>{obj.name}</h1>
      <h3>{obj.place}</h3>
      <h3>{obj.time}</h3>
      <p>{obj.description}</p>
    </div>
  );
}
