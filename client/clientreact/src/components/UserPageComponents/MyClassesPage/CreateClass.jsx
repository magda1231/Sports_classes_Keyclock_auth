import Cookies from "universal-cookie";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  name: Yup.string(), //.required("Name is required"),
  description: Yup.string(), //.required("Description is required"),
  date: Yup.string(), //.required("Date is required"),
  price: Yup.string(), //.required("Price is required"),
  duration: Yup.string(), //.required("Duration is required"),
  category: Yup.string(), //.required("Category is required"),
  maxPeople: Yup.string(), //.required("Max people is required"),
});

export default function CreateClass({ refresh }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // useEffect(() => {
  //   console.log(get());
  // }, [handleSubmit]);

  const onSubmit = (data) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    console.log();
    fetch(`http://localhost:3003/createclass`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status !== 201) {
          alert("Zajęcia nie zostały stworzone zmień nazwę!");
        } else if (res.status === 413) {
          console.log(res.status);
          alert("Zdjęcie ma zbyt duza wielkość, zmień je na mniejsze!");
        } else {
          alert("Zajęcia zostały stworzone odswież stronę!");
          refresh(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    reset();
  };

  // const today = new Date();

  return (
    <div className="CreateClass">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Stwórz zajęcia!</h1>
        <label>Nazwa zajęć</label>
        <input type="text" {...register("name")} name="name" id="name" />
        <label>Opis zajęć</label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="10"
          {...register("description")}
        ></textarea>
        <label>Cena</label>
        <input type="text" name="price" id="price" {...register("price")} />
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
        <label>Czas trwania</label>
        <input
          type="text"
          name="duration"
          id="duration"
          {...register("duration")}
        />
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
      </form>
    </div>
  );
}
