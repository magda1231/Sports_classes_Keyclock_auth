import React from "react";
import Cookies from "universal-cookie";

export default function UnSignToClass({ id }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

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
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        if (err.status === 409) {
          alert("Nie udało się anulować rezerwacji");
        }
      });
  };

  return <button onClick={handleSigning}>Anuluj zapis na zajęcia</button>;
}
