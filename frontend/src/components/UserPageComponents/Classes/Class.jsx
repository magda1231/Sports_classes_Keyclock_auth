import { Link } from "react-router-dom";

import Delete from "./Delete";
import SignToClass from "./UserFunctions/SignToClass";
import UnSignFromClass from "./UserFunctions/UnSign";
import Comments from "./Comments/Comments";
import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

// import Chat from "../Chat/Chatt";

export default function Class({ obj, role }) {
  const { keycloak } = useKeycloak();
  const admin_edit_buttons = (
    <>
      {window.location.pathname === "/adminpanel" && (
        <div className="   space-x-3">
          <Delete id={obj.id} />
        </div>
      )}
    </>
  );
  const trainer_edit_buttons = (
    <>
      {window.location.pathname === "/myclasses" && (
        <div className="   space-x-3">
          {obj.id && (
            <Link
              className=" bg-[#7eb77f] p-2   rounded-3xl  text-xs text-white"
              to={`/myclasses/${obj.id}`}
            >
              Zaktualizuj dane
            </Link>
          )}
          <Delete id={obj.id} />
        </div>
      )}
    </>
  );
  const [showComments, setShowComments] = useState(false);
  const participant_edit_buttons = (
    <div className=" flex flex-col w-full">
      <div className="flex flex-row">
        {window.location.pathname === "/userpage" && (
          <div className="h-min">
            <SignToClass id={obj.id} />
          </div>
        )}
        {window.location.pathname === "/myclasses" && (
          <div className="class">
            <UnSignFromClass id={obj.id} />
          </div>
        )}

        <div className="mx-10 w-90 h-min">
          <button
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            {" "}
            Display Comments
          </button>
        </div>
      </div>
      {showComments && <Comments id={obj.id} />}
    </div>
  );

  return (
    <div id="class">
      <h2 className="text-2xlg font-medium text-center text-pink-600">
        {obj.name}
      </h2>
      <div className="flex">
        <p className="mr-2 font-medium">
          City: <b>{obj.city}</b>
        </p>
        <p className="">
          Place: <b>{obj.place}</b>
        </p>
      </div>
      <div className=" flex">
        <p className="mr-2 font-medium">
          Date: <b>{obj.date}</b>
        </p>
        <p className="font-medium">
          Hour: <b>{obj.hour}</b>
        </p>
      </div>
      <div className="">
        <p className="font-medium">
          Category: <b>{obj.category}</b>
        </p>
      </div>
      <div className="">
        <p className="font-medium">
          Price: <b>{obj.price}</b>
        </p>
      </div>
      <div className="">
        <p className="font-medium">
          Max participants: <b>{obj.maxPeople}</b>
          <br />
          Registered: <b>{obj.registered}</b>
        </p>
      </div>
      <div>
        <p className=" mt-4">{obj.description}</p>
      </div>
      <div className="flex justify-between">
        {role === "trainer" && trainer_edit_buttons}
        {role === "user" && participant_edit_buttons}
        {keycloak.hasRealmRole("admin") && admin_edit_buttons}
      </div>
    </div>
  );
}
