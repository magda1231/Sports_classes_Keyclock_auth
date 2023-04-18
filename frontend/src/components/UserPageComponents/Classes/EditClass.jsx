import Cookies from "universal-cookie";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "../../../Contexts/RefreshContext";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";

const today = new Date();

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.string().required("Date is required"),

  hour: Yup.string().required("Hour is required"),
  price: Yup.number("Must be a number")
    .positive("Must be positive")
    .required("Price is required")
    .typeError("Price must be a number"),
  duration: Yup.string().required("Duration is required"),
  category: Yup.string().required("Category is required"),
  maxPeople: Yup.string().required("Max people is required"),
});

export default function EditClass() {
  const id = useParams().id;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { refresh, setRefresh } = Refresh();

  const onSubmit = (data) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    console.log();
    fetch(`http://localhost:3003/myclasses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 201) {
          setError("submit", {
            message: "Zajęcia nie zostały stworzone!",
          });
        } else if (res.status === 413) {
          setError("submit", { message: "Zbyt duza ilosc znakow w opisie " });
        } else if (res.status == 400) {
          setError("submit", {
            message: "Zajęcia nie zostały stworzone zmień nazwę!",
          });
        } else if (res.status === 201) {
          navigate("/myclasses");
          setRefresh(!refresh);
          reset();
        }
      })
      .catch((err) => {
        alert("Zajęcia nie zostały zedytowane!");
      });
  };

  return (
    <>
      <Navbar />
      <div className="CreateClass">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Edytuj Zajęcia!</h1>
          <label>Nazwa zajęć</label>
          <input type="text" {...register("name")} name="name" id="name" />
          {errors.name && <p>{errors.name.message}</p>}
          <label>Opis zajęć</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            {...register("description")}
          ></textarea>
          {errors.description && <p>{errors.description.message}</p>}
          <label>Cena</label>
          <input name="price" id="price" {...register("price")} />
          {errors.price && <p>{errors.price.message}</p>}

          <label>Miasto</label>
          <input type="text" name="city" id="city" {...register("city")} />
          {errors.city && <p>{errors.city.message}</p>}
          <label>Miejsce</label>
          <input type="text" name="place" id="place" {...register("place")} />
          {errors.place && <p>{errors.place.message}</p>}
          <label>Data</label>
          <input
            type="date"
            min={new Date()}
            name="date"
            id="date"
            {...register("date")}
          />
          {errors.date && <p>{errors.date.message}</p>}
          <label>Godzina</label>
          <input type="time" name="time" id="time" {...register("hour")} />
          {errors.hour && <p>{errors.hour.message}</p>}
          <label>Czas trwania</label>
          <input
            type="text"
            name="duration"
            id="duration"
            {...register("duration")}
          />
          {errors.duration && <p>{errors.duration.message}</p>}
          <label> Maksymalna liczba uczestników</label>
          <input
            type="text"
            name="maxPeople"
            id="max"
            {...register("maxPeople")}
          />
          {errors.maxPeople && <p>{errors.maxPeople.message}</p>}

          <label>Kategoria</label>
          <input
            type="text"
            name="category"
            id="category"
            {...register("category")}
          />
          {errors.category && <p>{errors.category.message}</p>}
          <button className="  bg-slate-500" type="submit" id="button">
            Dodaj zajęcia
          </button>
          <div className=" pb-10 m-0">
            {errors.submit && <p>{errors.submit.message}</p>}
          </div>
        </form>
      </div>
    </>
  );
}
