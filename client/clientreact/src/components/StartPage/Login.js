import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
//import authSlice from "../Auth/authSlice";
import { setToken } from "../../Auth/authSlice";
import jwtDecode from "jwt-decode";

import { useDispatch, useSelector } from "react-redux";

export const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required!"),
});

export default function Login() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const user = useSelector((state) => state.auth);
  // dispatch(setToken(user));

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  //get values
  // const { username, password } = getValues();

  // console.log("aaa");

  const fetchfunction = (endpoint, data) => {
    fetch(`http://localhost:3003/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("response", response.status);
        if (response.ok) {
          navigate("/userpage");
          // dispatch(setToken(data));
          return response.json();
        } else if (response.status == 403) {
          return;
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(async (data) => {
        await data;
        cookies.set("token", data, { path: "/" });
        const token = jwtDecode(data.accessToken);
        dispatch(setToken(token.role));
        // console.log("us", us);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onSubmit = async (data) => {
    fetchfunction("login", data);
  };

  return (
    <div className="login">
      <h2>Zaloguj się</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="username"
          placeholder="USERNAME"
          {...register("username")}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input
          type="password"
          name="password"
          placeholder="PASSWORD"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <button>ZALOGUJ SIĘ</button>
      </form>
    </div>
  );
}
