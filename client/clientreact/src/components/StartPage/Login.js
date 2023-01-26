import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required!"),
});

export default function Login() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const fetchfunction = (endpoint, data) => {
    console.log("data", data);
    fetch(`http://localhost:3003/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          //   navigate("/userpage");
          return response.json();
        } else if (response.status == 403) {
          return;
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        console.log("data", data);
        cookies.set("token", data, { path: "/" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async (data) => {
    await data;
    console.log("data", data);
    fetchfunction("login", data);
  };

  return (
    <div className="login">
      <h2>Zaloguj się</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" placeholder="USERNAME" />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input type="password" name="password" placeholder="PASSWORD" />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <button>ZALOGUJ SIĘ</button>
      </form>
    </div>
  );
}
