import { useEffect } from "react";
import ListClasses from "./Classes/ListClasses";

import { useSelector, useDispatch } from "react-redux";
import { fetchMain } from "../ActionsReducers/API_Actions";

export default function Main() {
  const state = useSelector((state) => state);

  const { mainPageClasses, error, loading } = useSelector((state) => state);

  const dispatch = useDispatch();
  console.log(mainPageClasses);

  useEffect(() => {
    console.log(mainPageClasses);
    dispatch(fetchMain());
  }, [dispatch]);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error: {error}</h1>}
      {mainPageClasses && <ListClasses lista={mainPageClasses} />}
    </>
  );
  // return <ListClasses lista={res} />;
}
