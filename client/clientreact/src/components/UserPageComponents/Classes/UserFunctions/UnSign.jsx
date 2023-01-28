import React from "react";
import Cookies from "universal-cookie";
import { Refresh } from "../../../../ThemeContext/RefreshContext";

export default function UnSignFromClass({ id }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const { refresh, setRefresh } = Refresh();

  const handleSigning = () => {
    fetch(`http://localhost:3003/myclasses/unsign/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.ok) {
          if (res.status === 200) alert("Anulowano rezerwacje");
          setRefresh(!refresh);
          return res.json();
        }
        throw res;
      })
      .catch((err) => {
        if (err.status === 409) {
          alert("Nie udało się anulować rezerwacji");
        }
      });
  };

  return <button onClick={handleSigning}>Anuluj zapis na zajęcia</button>;
}
