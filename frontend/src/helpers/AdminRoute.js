import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const isLoggedIn = keycloak.authenticated && keycloak.hasRealmRole("admin");
  if (!isLoggedIn) {
    navigate("/");
    return null;
  } else {
    return children;
  }
};

export default AdminRoute;
