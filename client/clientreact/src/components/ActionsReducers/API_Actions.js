import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

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
