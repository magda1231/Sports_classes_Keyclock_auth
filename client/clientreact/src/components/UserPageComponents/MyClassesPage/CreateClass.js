import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

export default function CreateClass() {
  const [classinfo, setClassinfo] = useState({});
  const [classmade, setClassmade] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    console.log(classinfo);
    if (e.target.name == "image") {
      const file = e.target.files[0];
      const reader = new FileReader();
      console.log(file.size);
      if (file.size > 60000) {
        alert("Zdjęcie jest za duże, zmień je na mniejsze!");
        return;
      }
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        setClassinfo({
          ...classinfo,
          image: img.src,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setClassinfo({
        ...classinfo,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    console.log(classinfo);

    e.preventDefault();
    fetch(`http://localhost:3003/createclass`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classinfo),
    })
      .then((res) => {
        if (res.status != 201) {
          alert("Zajęcia nie zostały stworzone zmień nazwę!");
        } else if (res.status == 413) {
          console.log(res.status);
          alert("Zdjęcie ma zbyt duza wielkość, zmień je na mniejsze!");
        } else {
          alert("Zajęcia zostały stworzone odswież stronę!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //get todays date
  const today = new Date();

  return (
    <div className="CreateClass">
      <form onSubmit={handleSubmit}>
        <h1>Stwórz zajęcia!</h1>
        <label>Nazwa zajęć</label>
        <input type="text" name="name" id="name" onChange={handleChange} />
        <label>Opis zajęć</label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="10"
          onChange={handleChange}
        ></textarea>
        <label>Cena</label>
        <input type="text" name="price" id="price" onChange={handleChange} />

        <label>Miasto</label>
        <input type="text" name="city" id="city" onChange={handleChange} />
        <label>Miejsce</label>
        <input type="text" name="place" id="place" onChange={handleChange} />
        <label>Data</label>
        <input
          type="date"
          min={new Date()}
          name="date"
          id="date"
          onChange={handleChange}
        />
        <label>Godzina</label>
        <input type="time" name="time" id="time" onChange={handleChange} />
        <label>Czas trwania</label>
        <input
          type="text"
          name="duration"
          id="duration"
          onChange={handleChange}
        />
        <label> Maksymalna liczba uczestników</label>
        <input type="text" name="max" id="max" onChange={handleChange} />
        <label>Minimalna liczba uczestników</label>
        <input type="text" name="min" id="min" onChange={handleChange} />
        <label>Kategoria</label>
        <input
          type="text"
          name="category"
          id="category"
          onChange={handleChange}
        />
        <label>Zdjęcie</label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleChange}
        />

        {/* <img width="50px" height="50px" src={URL.} /> */}
        <button type="submit" id="button">
          Dodaj zajęcia
        </button>
      </form>
    </div>
  );
}