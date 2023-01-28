import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import ContextThemeButton from "../../ThemeContext/ContextThemeButton";
import { useTheme } from "../../ThemeContext/ThemeContext";
import { clearToken } from "../../Auth/authSlice";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    cookies.remove("token");
    dispatch(clearToken());
    navigate("/");
  };
  const { theme } = useTheme();
  return (
    <div className="Navbar">
      <style>
        {`
       body{
            background-color: ${
              theme === "light" ? "white" : "rgba(0, 0, 0, 0.85)"
            };
            color: ${theme === "light" ? "black" : "white"};
        }
        nav{
            background-color: ${theme === "light" ? "#7eb77f;" : "#286c298a"};
            color: ${theme === "light" ? "black" : "white"};
            background: ${
              theme === "dark" &&
              "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%);"
            };
            
          
            }
        }
        ul li{
            background-color: ${theme === "light" ? "#7eb77f;" : "#286c298a"};
            color: ${theme === "light" ? "black" : "white"};
        }
        nav ul li button{
          background-color: ${theme === "light" ? "#7eb77f;" : ""};
          color: ${theme === "light" ? "black" : "white"};
      }
      input{
        background-color: ${theme === "light" ? "white" : "#D3D3D3 "};
        color: ${theme === "light" ? "black" : "white"};
      }

      textarea{
        background-color: ${theme === "light" ? "white" : "#D3D3D3 "};
        color: ${theme === "light" ? "black" : "white"};
        border:none;}
      h1{
        color: ${theme === "light" ? "black" : "rgb(163, 60, 115)"};
      }
      
            `}
      </style>

      <nav>
        <ul>
          <li>
            <Link to="/userpage">Strona główna</Link>
          </li>
          <li>
            <Link to="/myclasses">Moje zajęcia</Link>
          </li>
        </ul>
        <ul>
          <li>
            <ContextThemeButton />
          </li>
          <li>
            <button onClick={handleLogout} className="Logout">
              Wyloguj się
            </button>
          </li>
          <div className="logo">
            <button className="logo">
              <Link to="/mypage"></Link>
            </button>
          </div>
        </ul>
      </nav>
    </div>
  );
}
