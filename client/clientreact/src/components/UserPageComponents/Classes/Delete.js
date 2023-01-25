export default function Delete(props) {
  const handleDelete = () => {
    fetch(`http://localhost:3001/classes/${props.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        props.setClasses(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button className="delete" onClick={handleDelete}>
      Usuń
    </button>
  );
}
