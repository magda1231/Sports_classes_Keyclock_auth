import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import Cookies from "universal-cookie";

export default function Login() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  const handleClick = () => {
    keycloak.login();
  };

  if (keycloak.authenticated) {
    navigate("/userpage");
  }
  return (
    <>
      {!keycloak.authenticated && <button onClick={handleClick}>Login</button>}
      {keycloak.authenticated && (
        <>
          <div style={{ display: "flex", flex: "row" }}>
            {" "}
            <button onClick={() => keycloak.logout()}>Logout</button>
            <button onClick={() => navigate("/userpage")}>UserPage</button>
          </div>
        </>
      )}
    </>
  );
}
