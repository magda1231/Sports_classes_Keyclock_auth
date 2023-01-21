import Navbar from "./Navbar";
import Classes from "./Classes/Classes";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router";
import { NotFound } from "../NotFound";
import Aside from "./Aside";

// import { Connector } from "mqtt-react-hooks";

export default function UserPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");
  // console.log(token);
  // const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const token = cookies.get("token");
  // }, []);

  // axios
  //   .get("http://localhost:3003/userpage")
  //   .then((res) => {
  //     return res;
  //   })
  //   .catch((err) => {
  //     // return <NotFound />;
  //   });
  // token = null ? navigate("/") : null;
  return (
    <>
      {token != null && <Navbar />}
      {token == null && navigate("/whopsnoaccess")}
      {/* <Navbar /> */}
      <div className="Main">
        <Classes />
        {/* <Connector brokerUrl="mqtt://127.0.0.1:1883"> */}
        <Aside />
        {/* </Connector> */}
      </div>
    </>
  );
}
