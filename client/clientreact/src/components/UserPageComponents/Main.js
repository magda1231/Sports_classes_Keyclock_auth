import { useEffect } from "react";
import ListClasses from "./Classes/ListClasses";

import { useSelector, useDispatch } from "react-redux";
import { fetchMain } from "../../ActionsReducers/API_Actions";

export default function Main() {
  const state = useSelector((state) => state);

  const { mainPageClasses, error, loading } = useSelector((state) => state.get);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMain());
  }, [dispatch]);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error ? <h1>Error: {error}</h1> : null}
      {mainPageClasses && <ListClasses lista={mainPageClasses} />}
    </>
  );
  // return <ListClasses lista={res} />;
}
