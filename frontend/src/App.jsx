import StartPage from "./components/StartPage/StartPage";
import { Routes, Route } from "react-router-dom";
import UserPage from "./components/UserPageComponents/UserPage";
import { NotFound } from "./components/NotFound";
import MyClasses from "./components/UserPageComponents/MyClassesPage/Myclasses";
import EditClass from "./components/UserPageComponents/Classes/EditClass";
import { useNavigate } from "react-router-dom";

import MyPage from "./components/UserPageComponents/Profile/MyPage";

import Chat from "./components/UserPageComponents/Chat/Chat";

import PrivateRoute from "./helpers/PrivateRoute";

function App() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const cookies = new Cookies();
  //   const token = cookies.get("token");
  // //   if (!token && window.location.pathname !== "/") {
  // //     navigate("/whops", { replace: true });
  // //   }
  // // }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />

      <Route
        path="/userpage"
        element={
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/myclasses"
        element={
          <PrivateRoute>
            <MyClasses />
          </PrivateRoute>
        }
      />
      <Route
        path="/myclasses/:id"
        element={
          <PrivateRoute>
            <EditClass />
          </PrivateRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/whops"
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
