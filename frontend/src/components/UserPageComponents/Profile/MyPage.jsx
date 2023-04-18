import Navbar from "../Navbar";
import EditProfile from "./EditProfile";
import { useState } from "react";

export default function MyPage() {
  const [display, setDisplay] = useState(false);
  return (
    <div>
      <Navbar />
      <div className="  flex justify-center  text-lg   bg-slate-200 opacity-60 w-8/12 m-auto p-4 rounded-lg">
        <button className=" h-10  w-48 " onClick={() => setDisplay(!display)}>
          Edytuj profil
        </button>
      </div>
      {display === true && <EditProfile />}
    </div>
  );
}
