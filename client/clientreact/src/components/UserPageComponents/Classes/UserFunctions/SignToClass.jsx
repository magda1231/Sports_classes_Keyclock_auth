import React from "react";
import Cookies from "universal-cookie";

export default function SignToClass({ id }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const handleSigning = () => {
    fetch(`http://localhost:3003/myclasses/register/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.ok) {
          if (res.status === 200) alert("Zapisano na zajęcia");
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        if (err.status === 409) {
          alert("Już jesteś zapisany na to zajęcie");
        }
      });
  };

  return <button onClick={handleSigning}>Zapisz się na zajęcia</button>;
}
