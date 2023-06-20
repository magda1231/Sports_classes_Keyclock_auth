import React from "react";
import "../../style/styles.scss";
import Login from "./Login";

const StartPage = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="left-side">
          <div className="info">
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
          <h1 className="h1">
            Dołącz do nas <br /> już dziś!
          </h1>
          <div className="button">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
