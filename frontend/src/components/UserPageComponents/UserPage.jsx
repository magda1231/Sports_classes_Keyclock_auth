import Navbar from "./Navbar";
import Main from "./Main";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";

import { useEffect } from "react";
import { useTheme } from "../../Contexts/ThemeContext";

export default function UserPage() {
  const navigate = useNavigate();

  const { theme } = useTheme();
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
      {/* {token != null && <Navbar />} */}
      <Navbar />
      {/* {token == null && navigate("/whopsnoaccess")} */}
      <div className="Main">
        <Main />
      </div>
    </>
  );
}
