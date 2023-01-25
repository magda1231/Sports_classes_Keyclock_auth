import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EditClass from "./EditClass";

export default function Class({ obj }) {
  return (
    <div className="Class">
      {obj.image !== "undefined" ? (
        <img width="400px" src={obj.image} alt="img" />
      ) : null}
      <h1>{obj.name}</h1>
      <h2>{obj.type}</h2>
      <div className="important_info">
        <h3>Miasto: {obj.city}</h3>
        <br />
        <h3>Miejsce: {obj.place}</h3>
        <h3>Godzina: {obj.time}</h3>
        <h4>Cena: {obj.price}</h4>
        <h4>Data: {obj.date}</h4>
      </div>
      <p>{obj.description}</p>

      {window.location.pathname == "/myclasses" && (
        <div className="class">
          {/* <a href="">
            {obj.id && (
              // <Link to={`/myclasses/${obj.id.toString()}`}>
              //   Zaktualizuj dane
              // </Link>
            )}
          </a> */}
        </div>
      )}
    </div>
  );
}
