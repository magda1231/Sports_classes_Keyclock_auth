import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { setToken } from "../../Auth/authSlice";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
// import bcrypt from "bcryptjs";

export const schema = yup.object().shape({
  username: yup.string(),
  // .required("Username is required")
  // .matches(/^(?!\s)(?!.*\s$)/, "Username cannot contain space or tab")
  // .max(20, "Max 7")
  // .matches(
  //   /^[a-zA-Z0-9]+$/,
  //   "Username must contain only letters and numbers"
  //),
  password: yup.string(),
  // .required("Password is required!")
  // .matches(/^(?!\s)(?!.*\s$)/, "Username cannot contain space or tab")
  // .min(8, "Minumum 8 characters")
  // .max(20, "Maximum 20 characters")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter and one number"
  // ),
  email: yup.string().email("Email is not valid").required("Email is required"),
  role: yup
    .string()
    .oneOf(["user", "trainer"], "Role is not valid")
    .required("Role is required"),
});

export default function Register() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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
        } else {
          setError("submit", {
            message: "Nazwa uzytkownika juz istnieje wybierz inna",
          });
          return;
        }
      })
      .then(async (data) => {
        await data;
        cookies.set("token", data, { path: "/" });
        const token = jwtDecode(data.accessToken);
        dispatch(setToken(token));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSubmit = async (data) => {
    //data.password = await bcrypt.hash(data.password, 10);
    // console.log(data);

    fetchfunction("register", data);
  };

  return (
    <div className="register">
      <h2>Zarejestruj się</h2>
      <form id="ala" onSubmit={handleSubmit(onSubmit)}>
        <style>
          {`
         ${
           errors.submit &&
           "#email,#rpassword,#rusername,#role{outline: none !important;border:1px solid red; transition: all 0.3s ease-out;}"
         }

        
          
        `}
        </style>
        <input
          id="rusername"
          type="text"
          name="username"
          {...register("username")}
          placeholder="NAZWA UŻYTKOWNIKA"
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input
          className="inputt"
          id="email"
          type="email"
          name="email"
          {...register("email")}
          placeholder="E-MAIL"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          id="rpassword"
          type="password"
          name="password"
          placeholder="HASŁO"
          {...register("password")}
        />

        {errors.password && <p className="error">{errors.password.message}</p>}
        <div className="  bg-white rounded-xl   opacity-80">
          <select
            className="  h-7  text-sm rounded-none  opacity-70"
            name="role"
            {...register("role")}
            id="role"
          >
            <option value="wybierz">Wybierz kim chcesz być</option>
            <option value="user">Uczestnik zajęc</option>
            <option value="trainer">Trener</option>
          </select>
        </div>
        {errors.role && <p className="error">{errors.role.message}</p>}

        <button>ZAREJESTRUJ SIĘ</button>
        {errors.submit && <p className="error">{errors.submit.message}</p>}
      </form>
    </div>
  );
}
