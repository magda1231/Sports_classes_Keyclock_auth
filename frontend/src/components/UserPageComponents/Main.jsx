import { useEffect, useLayoutEffect, useMemo } from "react";
// import { useLayoutEffect } from "react";
import ListClasses from "./Classes/ListClasses";
import { useSelector, useDispatch } from "react-redux";
import { fetchMain } from "../../ActionsReducers/API_Actions";
import { Refresh } from "../../Contexts/RefreshContext";

export default function Main() {
  const { mainPageClasses, error, loading } = useSelector((state) => state.get);

  const { refresh } = Refresh();

  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(fetchMain());
  }, [dispatch, refresh]);
  return (
    <>
      {/* <Timer /> */}
      {/* <div className=""> */}
      {loading && <h1>Loading...</h1>}
      {error ? <h1>Error: {error}</h1> : null}
      {mainPageClasses && <ListClasses lista={mainPageClasses} />}
      {/* </div> */}
    </>
  );
  //return <ListClasses lista={res} />;
}
