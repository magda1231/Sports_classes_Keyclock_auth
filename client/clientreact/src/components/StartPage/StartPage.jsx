import React from "react";
import Login from "./Login";
import Register from "./Register";

const StartPage = () => {
  return (
    <div className="body">
      <style>
        {`
        .error{
          color: red;
          font-size: 12px;
          padding: 0;
          margin: 0;
        }
        `}
      </style>
      <div className="container">
        <div className="left-side">
          <Login />
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
          <h1 className="h1">Dołącz do nas już dziś!</h1>
          <Register />
        </div>
      </div>
    </div>
  );
};

export default StartPage;
