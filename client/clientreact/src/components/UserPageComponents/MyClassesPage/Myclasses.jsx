import Navbar from "../Navbar";

import CreateClass from "./CreateClass";
import { useEffect, useState, useLayoutEffect } from "react";
import ListClasses from "../Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyClasses } from "../../../ActionsReducers/API_Actions";
import { Refresh } from "../../../ThemeContext/RefreshContext";
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
          {loading && (
            <h1 className="flex flex-row justify-end text-slate-500 place-items-center">
              Loading
              <div className="flex align-bottom">
                <ThreeDots
                  height="30"
                  width="50"
                  radius="5"
                  color="rgb(75 85 99)"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            </h1>
          )}
          {error && <h1>Error: {error}</h1>}
          {myClasses && <ListClasses lista={myClasses} />}
        </div>

        {user === "trainer" && <CreateClass />}
      </div>
    </>
  );
}
