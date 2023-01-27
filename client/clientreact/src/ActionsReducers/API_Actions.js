import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

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

export const fetchAddRegister = createAsyncThunk("fetchAdd", async (data) => {
  try {
    const navigate = useNavigate();
    const fetchfunction = (endpoint, data) => {
      const cookies = new Cookies();
      fetch(`http://localhost:3003/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            navigate("/userpage");
            return response.json();
          } else if (response.status == 403) {
            return;
          }
        })
        .then((data) => {
          data && cookies.set("token", data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  } catch (error) {
    throw error;
  }
});
