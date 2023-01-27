import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";
import EditClass from "./EditClass";
import SignToClass from "./UserFunctions/SignToClass";
import { useSelector } from "react-redux";

export default function Class({ obj, role }) {
  //console.log(window.location.pathname);
  const trainer_edit_buttons = (
    <>
      {window.location.pathname == "/myclasses" && (
        <div className="class">
          {obj.id && <Link to={`/myclasses/${obj.id}`}>Zaktualizuj dane</Link>}
          <Delete id={obj.id} />
        </div>
      )}
    </>
  );
  const participant_edit_buttons = (
    <>
      {window.location.pathname == "/userpage" && (
        <div className="class">
          <SignToClass id={obj.id} />
        </div>
      )}
    </>
  );

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
      <div>
        {role === "trainer" && trainer_edit_buttons},
        {role === "user" && participant_edit_buttons}
      </div>
    </div>
  );
}
