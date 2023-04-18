import Navbar from "../Navbar";

import CreateClass from "./CreateClass";
import { useEffect, useState, useLayoutEffect } from "react";
import ListClasses from "../Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../../ActionsReducers/API_Actions";
import { Refresh } from "../../../Contexts/RefreshContext";
import { ThreeDots } from "react-loader-spinner";

export default function MyClasses({ obj }) {
  const { myClasses, error, loading } = useSelector((state) => state.get);

  const user = useSelector((state) => state.auth.role);
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
