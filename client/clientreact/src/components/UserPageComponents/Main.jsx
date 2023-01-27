import { useEffect } from "react";
import ListClasses from "./Classes/ListClasses";

import { useSelector, useDispatch } from "react-redux";
import { fetchMain } from "../../ActionsReducers/API_Actions";

export default function Main() {
  const { mainPageClasses, error, loading } = useSelector((state) => state.get);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMain());
  }, [dispatch]);
  return (
    <>
      {/* <div className=""> */}
      {loading && <h1>Loading...</h1>}
      {error ? <h1>Error: {error}</h1> : null}
      {mainPageClasses && <ListClasses lista={mainPageClasses} />}
      {/* </div> */}
    </>
  );
  // return <ListClasses lista={res} />;
}
