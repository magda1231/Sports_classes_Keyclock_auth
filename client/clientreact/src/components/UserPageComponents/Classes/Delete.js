import Cookies from "universal-cookie";

export default function Delete(props) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const handleDelete = () => {
    fetch(`http://localhost:3003/myclasses`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: props.id }),
    })
      .then((res) => {
        if (res.status == 200) {
          alert(
            "Zajęcia zostały usunięte, odświez stronę aby wyswietlic aktualne swoje zajecia"
          );
        }
      })
      .then((data) => {
        // props.setClasses(data);
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
