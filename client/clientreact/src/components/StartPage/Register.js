import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

export const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(/^(?!\s)(?!.*\s$)/, "Username cannot contain space or tab")
    .max(20, "Max 7")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username must contain only letters and numbers"
    ),

  password: yup
    .string()
    .required("Password is required!")
    .matches(/^(?!\s)(?!.*\s$)/, "Username cannot contain space or tab")
    .min(8, "Minumum 8 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter and one number"
    ),

  email: yup.string().email("Email is not valid").required("Email is required"),
  role: yup
    .string()
    .oneOf(["user", "trainer"], "Role is not valid")
    .required("Role is required"),
});

export default function Register() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const fetchfunction = (endpoint, data) => {
    fetch(`http://localhost:3003/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/userpage");
          return response.json();
        } else if (response.status == 403) {
          return;
        }
      })
      .then((data) => {
        console.log("data", data);

        data && cookies.set("token", data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSubmit = async (data) => {
    await data;
    console.log("data", data);
    fetchfunction("register", data);
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="username"
          {...register("username")}
          placeholder="USERNAME"
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input
          type="email"
          name="email"
          {...register("email")}
          placeholder="E-MAIL"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          name="password"
          placeholder="HASŁO"
          {...register("password")}
        />

        {errors.password && <p className="error">{errors.password.message}</p>}
        <select name="role" {...register("role")} id="role">
          <option value="wybierz">Wybierz kim chcesz być</option>
          <option value="user">Uzytkownik</option>
          <option value="trainer">Trainer</option>
        </select>
        {errors.role && <p className="error">{errors.role.message}</p>}

        <button>ZAREJESTRUJ SIĘ</button>
      </form>
    </div>
  );
}
