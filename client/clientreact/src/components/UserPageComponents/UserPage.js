import Navbar from "./Navbar";
import Main from "./Main";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router";
import Aside from "./Aside";

export default function UserPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");

  return (
    <>
      {token != null && <Navbar />}
      {token == null && navigate("/whopsnoaccess")}
      <div className="Main">
        <Main />
        <Aside />
      </div>
    </>
  );
}
