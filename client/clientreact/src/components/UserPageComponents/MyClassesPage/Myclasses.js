import Navbar from "../Navbar";
import Cookies from "universal-cookie";
import CreateClass from "./CreateClass";
import { useEffect, useState } from "react";
import ListClasses from "../Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../ActionsReducers/API_Actions";
// import { useTheme } from "../ThemeContext/ThemeContext";

export default function MyClasses({ obj }) {
  const dispatch = useDispatch();
  const { myClasses, error, loading } = useSelector((state) => state);
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

        <CreateClass />
      </div>
    </>
  );
}
