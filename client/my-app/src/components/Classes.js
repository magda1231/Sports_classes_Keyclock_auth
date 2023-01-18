import { useEffect } from "react";
import axios from "axios";
import ListClasses from "./ListClasses";
import { useState } from "react";
import Class from "./Class";

export default function Classes() {
  const [res, setRes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3003/userpage", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRes(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return <ListClasses lista={res} />;
}
