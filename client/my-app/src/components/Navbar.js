import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="Navbar">
      <nav>
        <ul>
          <li>
            <a href="index.html">Strona Główna</a>
          </li>
          <li>
            <a href="logpage.html">Moje ćwiczenia</a>
          </li>
          <li>
            <button onClick={handleLogout} className="Logout">
              Wyloguj się
            </button>
          </li>
        </ul>
        <div className="logo"></div>
      </nav>
    </div>
  );
}
