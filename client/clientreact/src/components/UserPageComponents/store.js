import { configureStore } from "@reduxjs/toolkit";
import Reducer from "../ActionsReducers/Reducer";

export const store = configureStore(
  {
    reducer: Reducer,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
