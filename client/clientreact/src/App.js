import StartPage from "./components/StartPage";
import "./styles.css";
import { Routes, Route } from "react-router-dom";
import UserPage from "./components/UserPageComponents/UserPage.js";
import { NotFound } from "./components/NotFound";
import MyClasses from "./components/Myclasses";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/myclasses" element={<MyClasses />} />
      <Route path="/whopsnoaccess" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
