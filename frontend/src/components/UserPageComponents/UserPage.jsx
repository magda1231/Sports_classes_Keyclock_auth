import Navbar from "./Navbar";
import Main from "./Main";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";

import { useEffect } from "react";
import { useTheme } from "../../Contexts/ThemeContext";

export default function UserPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const { theme } = useTheme();
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
      </div>
    </>
  );
}
