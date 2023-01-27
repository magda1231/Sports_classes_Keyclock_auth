import Navbar from "../Navbar";
import Cookies from "universal-cookie";
import CreateClass from "./CreateClass";
import { useEffect, useReducer, useState } from "react";
import ListClasses from "../Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../../ActionsReducers/API_Actions";
import authSlice from "../../../Auth/authSlice";

export default function MyClasses({ obj }) {
  const { myClasses, error, loading } = useSelector((state) => state.get);

  const user = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyClasses());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div className="Trener">
        <div className="classes">
          {loading && <h1>Loading...</h1>}
          {error && <h1>Error: {error}</h1>}
          {myClasses && <ListClasses lista={myClasses} />}
        </div>

        {user == "trainer" && <CreateClass />}
      </div>
    </>
  );
}
