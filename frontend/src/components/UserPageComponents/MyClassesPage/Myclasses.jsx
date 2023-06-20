import Navbar from "../Navbar";

import CreateClass from "./CreateClass";
import { useEffect, useState, useLayoutEffect } from "react";
import ListClasses from "../Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../../ActionsReducers/API_Actions";
import { Refresh } from "../../../Contexts/RefreshContext";
import { ThreeDots } from "react-loader-spinner";
import { useKeycloak } from "@react-keycloak/web";
import jwtDecode from "jwt-decode";

export default function MyClasses({ obj }) {
  const { myClasses, error, loading } = useSelector((state) => state.get);
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak.token;
  console.log("moje klasy moje klasy");
  const user_trainer = jwtDecode(token).realm_access.roles.includes("trainer");

  // const user_trianer = jwtDecode(token).realm_access.contains("trainer");
  let user = "";
  if (user_trainer) {
    user = "trainer";
  }
  //const user = user_trianer ? "trainer" : "user";

  console.log("moje klasy moje klasy");

  const dispatch = useDispatch();

  const { refresh } = Refresh();

  useEffect(() => {
    dispatch(fetchMyClasses());
  }, [dispatch, refresh]);

  return (
    <>
      <Navbar />
      <div className="Trener">
        <div className="classes">
          {loading && <h1>Loading...</h1>}
          {error && <h1>Error: {error}</h1>}
          {myClasses && <ListClasses lista={myClasses} />}
        </div>

        {user === "trainer" && <CreateClass />}
      </div>
    </>
  );
}
