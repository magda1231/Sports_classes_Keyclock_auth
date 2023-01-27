import StartPage from "./components/StartPage/StartPage";
import { Routes, Route } from "react-router-dom";
import UserPage from "./components/UserPageComponents/UserPage.js";
import { NotFound } from "./components/NotFound";
import MyClasses from "./components/UserPageComponents/MyClassesPage/Myclasses";
import EditClass from "./components/UserPageComponents/Classes/EditClass";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import "./style/styles.css";

function App() {
  const navigate = useNavigate();

  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    if (!token && window.location.pathname != "/") {
      navigate("/whopsnoaccess", { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/myclasses" element={<MyClasses />} />
      <Route path="/myclasses/:id" element={<EditClass />} />
      {/* <Route path="/whopsnoaccess" element={<NotFound />} /> */}
      <Route
        path="/whopsnoaccess"
        element={
          <div>
            <h1>Page not found</h1>
          </div>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
