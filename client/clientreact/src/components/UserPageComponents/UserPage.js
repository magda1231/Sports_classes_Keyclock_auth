import Navbar from "./Navbar";
import Main from "./Main";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
import Aside from "./Aside";
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
//import { isAdmin } from "../Auth/authSlice";

export default function UserPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const dispatch = useDispatch();

  const admin = useSelector((state) => state.auth);

  useEffect(() => {
    // dispatch(isAdmin());
    console.log("sel", admin);
  }, [dispatch]);

  const { theme, setTheme } = useTheme();
  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <>
      {/* {isUser && <div>User</div>}
      {isAdmin && <div>Admin</div>} */}

      <style>
        {`
        body{
           background-color: ${theme === "light" ? "white" : "black"};
            color: ${theme === "light" ? "black" : "white"};
        }`}
      </style>

      {token != null && <Navbar />}
      {token == null && navigate("/whopsnoaccess")}
      <div className="Main">
        <Main />
        <Aside />
      </div>
    </>
  );
}
