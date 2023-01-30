import React from "react";
import Cookies from "universal-cookie";
import { useState } from "react";
import { Refresh } from "../../../../ThemeContext/RefreshContext";

export default function SignToClass({ id }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const [active, setActive] = useState(true);

  const { refresh, setRefresh } = Refresh();

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
          if (res.status === 200) {
            setRefresh(!refresh);
            alert("Zapisano na zajęcia");
            setActive(false);
            return res.json();
          }
          if (res.status === 409) alert("Już jesteś zapisany na to zajęcie");

          if (res.status === 404) alert("Nie udało się zapisać na zajęcia");
          if (res.status === 503)
            alert("Nie udało się zapisać na zajęcia limit osiagnieto");
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

  return (
    <>
      <button onClick={handleSigning}>Zapisz się na zajęcia</button>
    </>
  );
}
