import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const handleLogout = () => {
    cookies.remove("token");
    navigate("/");
  };
  return (
    <div className="Navbar">
      <nav>
        <ul>
          <li>
            <Link to="/userpage">Strona główna</Link>
          </li>
          <li>
            <Link to="/myclasses">Moje zajęcia</Link>
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
