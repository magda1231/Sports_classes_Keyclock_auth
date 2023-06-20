import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { useKeycloak } from "@react-keycloak/web";
import keycloak from "../Keycloack";

let token = "";

const KeycloackToken = () => {
  const { keycloak } = useKeycloak();
  token = keycloak.token;
};

export const fetchMain = createAsyncThunk("fetchMain", async () => {
  // const { keycloak } = useKeycloak();
  try {
    const response = await fetch("http://localhost:5010/userpage", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    // console.log("ala ma kota");
    return data;
  } catch (error) {
    console.log("ala ma kota");
    throw error;
  }
});

export const fetchMyClasses = createAsyncThunk("fetchMyClasses", async () => {
  // const { keycloak } = useKeycloak();
  console.log("fetchMyClasses");
  console.log(keycloak.token);

  const cookies = new Cookies();
  const token = cookies.get("token");
  try {
    const response = await fetch("http://localhost:5010/myclasses", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});
