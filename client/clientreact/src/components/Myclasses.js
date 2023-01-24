import Navbar from "./UserPageComponents/Navbar";
import Classes from "./UserPageComponents/Classes/Classes";
import Cookies from "universal-cookie";
import CreateClass from "./CreateClass";
import Class from "./UserPageComponents/Classes/Class";
import { useEffect, useState } from "react";
import ListClasses from "./UserPageComponents/Classes/ListClasses";

export default function MyClasses({ obj }) {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3003/myclasses", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    })
      .then((res) => {
        if (res.status != 200) {
          console.log(res.status);
          console.log("aaaaa");
        } else {
          console.log(res.status);
          console.log("AAAAA");
        }
        return res.json();
      })
      .then((res) => {
        setClasses(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [CreateClass]);
  return (
    <>
      <Navbar />
      <div className="Trener">
        <div className="classes">
          <ListClasses lista={classes} />
        </div>

        <CreateClass />
      </div>
    </>
  );
}
