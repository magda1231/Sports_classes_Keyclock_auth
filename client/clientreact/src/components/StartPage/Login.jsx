import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { setToken } from "../../Auth/authSlice";
import jwtDecode from "jwt-decode";

import { useDispatch } from "react-redux";

export const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required!"),
});

export default function Login() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

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
          return response.json();
        } else if (response.status === 403) {
          setError("submit", { message: "Złe dane" });
          return;
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(async (data) => {
        await data;
        cookies.set("token", data, { path: "/" });
        const token = jwtDecode(data.accessToken);
        dispatch(setToken(token));

        // console.log("us", us);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onSubmit = async (data) => {
    fetchfunction("login", data);
  };

  const style = {
    input: {
      border: "1px solid red",
    },
  };

  return (
    <div className="login">
      <h2>Zaloguj się</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <style>
          {`
         ${
           errors.submit &&
           "#username,#password {outline: none !important;border:1px solid red; transition: all 0.3s ease-out;}"
         }

        
          
        `}
        </style>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="NAZWA UŻYTKOWNIKA"
          {...register("username")}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input
          id="password"
          type="password"
          name="password"
          placeholder="PASSWORD"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <button>ZALOGUJ SIĘ</button>
        {/* {errors.submit && <p className="error">{errors.submit.message}</p>} */}
      </form>
    </div>
  );
}
