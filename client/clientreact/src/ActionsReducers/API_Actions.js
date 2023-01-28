import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
//import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../Auth/authSlice";

export const fetchMain = createAsyncThunk("fetchMain", async () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  try {
    const response = await fetch("http://localhost:3003/userpage", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.accessToken,
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

export const fetchMyClasses = createAsyncThunk("fetchMyClasses", async () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  try {
    const response = await fetch("http://localhost:3003/myclasses", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.accessToken,
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

export const fetchDelete = createAsyncThunk("fetchDelete", async (id) => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  try {
    const response = await fetch("http://localhost:3003/myclasses", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "content-type": "application/json",
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

export const fetchLogin = createAsyncThunk("login", async ({ data }) => {
  let endpoint = "login";
  // let data = data;
  const logindata = data;
  const cookies = new Cookies();
  const token = cookies.get("token");
  try {
    const response = await fetch(`http://localhost:3003/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.accessToken,
      },
      body: JSON.stringify(logindata),
    });
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    const cookies = new Cookies();
    cookies.set("token", data, { path: "/" });
    const token = cookies.get("token");
    const dispatch = useDispatch();
    dispatch(setToken(data.role));

    return data;
  } catch (error) {
    throw error;
  }
});
