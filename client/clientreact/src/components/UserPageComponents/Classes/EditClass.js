import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editClass } from "../API_Actions";

const EditClass = ({ user }) => {
  const [classInfo, setClassInfo] = useState(user);

  const handleChange = (e) => {
    e.preventDefault();
    setClassInfo({ ...classInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(editClass(classInfo));
    // navigate("/myclasses");
  };

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
          Defaultvalue={user.description}
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

        <button type="submit" id="button">
          Dodaj zajęcia
        </button>
      </form>
    </div>
  );
};

export default EditClass;
