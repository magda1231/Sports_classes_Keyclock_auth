import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import Cookies from "universal-cookie";

export default function Login() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    fetch("http://localhost:5010/check", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((res) => {
        console.log("local");
        console.log(res);
      })
      .catch((err) => {
        console.log("local" + err);
      });
    fetch("http://backendd:5010/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((res) => {
        console.log(res);
        console.log("backed");
      })
      .catch((err) => {
        console.log("backed" + err);
      });
  }, []);

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
