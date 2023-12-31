import React from "react";
import Cookies from "universal-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Cookie } from "universal-cookie";
import jwtDecode from "jwt-decode";

const schema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is required"),

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
});

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    fetch("http://localhost:3003/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Your profile has been updated");
          document.getElementById("form").reset();
        } else {
          throw new Error("Something went wrong");
        }
      })

      .catch((error) => {
        alert("Something went wrong try again");
      });
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="w-6/12 mx-auto ">
          <h1>My profile</h1>

          <div className="data">
            Cieszymy sie ze jests z nami jesli cos chcesz zmienic w swoim
            profilu to zapraszamy
          </div>
          <br />
          <form
            id="form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-4  flex  flex-col p-4  items-center border-8    h-auto"
          >
            <div className="flex  flex-col p-4    justify-around  justify-items-start h-64  w-8/12  ">
              <div className="flex justify-between space-x-2">
                <label className="  rounded-sm" htmlFor="email">
                  Email
                </label>
                <input
                  className="  bg-slate-200  rounded-sm"
                  type="email"
                  name="email"
                  id="email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <div className=" text-red-800">{errors.email.message}</div>
              )}
              <div className="flex justify-between space-x-2">
                <label htmlFor="password">Password</label>
                <input
                  className="  bg-slate-200  rounded-sm"
                  type="password"
                  name="password"
                  id="password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <div className=" text-red-800">{errors.password.message}</div>
              )}
            </div>
            <button className=" bg-slate-400" type="submit">
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
