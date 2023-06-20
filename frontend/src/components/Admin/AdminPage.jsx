import { useEffect, useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../ActionsReducers/API_Actions";
import { Refresh } from "../../Contexts/RefreshContext";
import { useKeycloak } from "@react-keycloak/web";
import jwtDecode from "jwt-decode";
import { fetchMain } from "../../ActionsReducers/API_Actions";

import ListClasses from "../UserPageComponents/Classes/ListClasses";
import Navbar from "../UserPageComponents/Navbar";

export default function Admin() {
  const { mainPageClasses, error, loading } = useSelector((state) => state.get);

  const { keycloak, initialized } = useKeycloak();
  const token = keycloak.token;

  const user_trainer = jwtDecode(token).realm_access.roles.includes("trainer");

  // const user_trianer = jwtDecode(token).realm_access.contains("trainer");

  const dispatch = useDispatch();

  const { refresh } = Refresh();

  useEffect(() => {
    dispatch(fetchMain());
  }, [dispatch, refresh]);

  return (
    <>
      <Navbar />
      <div className="Trener">
        <div className="classes">
          {loading && <h1>Loading...</h1>}
          {error && <h1>Error: {error}</h1>}
          {<ListClasses lista={mainPageClasses} />}
        </div>
      </div>
    </>
  );
}
