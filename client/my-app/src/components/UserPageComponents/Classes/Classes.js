import { useEffect } from "react";
import axios from "axios";
import ListClasses from "./ListClasses";
import { useState } from "react";
import Class from "./Class";
import Cookies from "universal-cookie";

export default function Classes() {
  const cookies = new Cookies();
  const [res, setRes] = useState([]);
  const token = cookies.get("token");
  console.log("a", token.accessToken);

  useEffect(() => {
    fetch("http://localhost:3003/userpage", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRes(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <ListClasses lista={res} />;
}
