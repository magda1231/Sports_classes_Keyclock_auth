import React, { useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Register = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegisterChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/login", loginData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/userpage";
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/register", registerData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="body">
      <div className="container">
        <div className="left-side">
          <div className="login">
            <h2>Zaloguj się</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="USERNAME"
                onChange={handleLoginChange}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="PASSWORD"
                onChange={handleLoginChange}
              />
              <button>ZALOGUJ SIĘ</button>
            </form>
          </div>
          <div className="Info">
            <h1>Szukasz ćwiczeń w twojej okolicy?</h1>
            <p>
              Witaj na naszym portalu sportowym! Tutaj możesz zarejestrować się
              jako trener lub użytkownik i cieszyć się różnorodnością zajęć
              sportowych.
              <br />
              <br />
              Jako trener, masz możliwość tworzenia własnych zajęć i
              pozyskiwania uczestników. <br />
              <br />
              Natomiast jako użytkownik, masz dostęp do szerokiej gamy zajęć i
              możliwości zapisania się na nie. Przyłącz się do naszej
              społeczności i rozwijaj swoją pasję sportową razem z nami.
            </p>
          </div>
        </div>
        <div className="right-side">
          <h1 classname="h1">Dołącz do nas już dziś!</h1>
          <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                name="username"
                placeholder="USERNAME"
                id="username"
                onChange={handleRegisterChange}
              />
              <input
                type="email"
                name="email"
                placeholder="E-MAIL"
                id="email"
                onChange={handleRegisterChange}
              />
              <input
                type="password"
                name="password"
                placeholder="HASŁO"
                id="password"
                onChange={handleRegisterChange}
              />
              <select name="role" id="role" onChange={handleRegisterChange}>
                <option value="wybierz">Wybierz kim chcesz być</option>
                <option value="user">Uzytkownik</option>
                <option value="trainer">Trainer</option>
              </select>
              <button>ZAREJESTRUJ SIĘ</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
