import Navbar from "./Navbar";
import Main from "./Main";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
import Aside from "./Aside";
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext/ThemeContext";
import ContextThemeButton from "../../ThemeContext/ContextThemeButton";

export default function UserPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const { theme, setTheme } = useTheme();
  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <>
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
