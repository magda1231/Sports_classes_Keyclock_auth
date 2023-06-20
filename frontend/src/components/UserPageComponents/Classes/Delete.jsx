import Cookies from "universal-cookie";
import { Refresh } from "../../../Contexts/RefreshContext";
import { useKeycloak } from "@react-keycloak/web";

export default function Delete(props) {
  const { keycloak, initialized } = useKeycloak();
  const cookies = new Cookies();
  const token = cookies.get("token");
  //console.log("aa");

  const { refresh, setRefresh } = Refresh();
  // console.log(refresh, "refresh");

  const handleDelete = () => {
    fetch(`http://localhost:5010/myclasses`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + keycloak.token,
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: props.id }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(refresh, "refreshb");
          setRefresh(!refresh);

          //console.log(refresh, "after refresh");

          // alert(
          //   "Zajęcia zostały usunięte, odświez stronę aby wyswietlic aktualne swoje zajecia"
          // );
        }
      })
      .catch((err) => {
        alert("Nie udało się usunąć zajęć");
      });
  };

  return (
    <button
      className=" bg-[#7eb77f] text-white text-xs p-2   rounded-3xl   w-24"
      onClick={handleDelete}
    >
      Usuń zajęcia
    </button>
  );
}
