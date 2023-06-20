import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const isLoggedIn = keycloak.authenticated;
  if (!isLoggedIn) {
    navigate("/");
    return null;
  } else {
    return children;
  }
  //   return isLoggedIn ? children : null;
};
export default PrivateRoute;
