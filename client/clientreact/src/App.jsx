import StartPage from "./components/StartPage/StartPage";
import { Routes, Route } from "react-router-dom";
import UserPage from "./components/UserPageComponents/UserPage";
import { NotFound } from "./components/NotFound";
import MyClasses from "./components/UserPageComponents/MyClassesPage/Myclasses";
import EditClass from "./components/UserPageComponents/Classes/EditClass";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import MyPage from "./components/UserPageComponents/Profile/MyPage";
import Cookies from "universal-cookie";
import "./style/styles.scss";
import Chat from "./components/UserPageComponents/Chat/Chat";

function App() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const cookies = new Cookies();
  //   const token = cookies.get("token");
  //   if (!token && window.location.pathname !== "/") {
  //     navigate("/whops", { replace: true });
  //   }
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/myclasses" element={<MyClasses />} />
      <Route path="/myclasses/:id" element={<EditClass />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/chat" element={<Chat />} />

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
