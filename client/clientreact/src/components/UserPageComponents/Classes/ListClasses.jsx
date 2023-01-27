import Class from "./Class";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

const ListProducts = ({ lista }) => {
  const inputRef = useRef(null);

  const role = useSelector((state) => state.auth.role);

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortClick = (sortCriteria) => {
    setSortBy(sortCriteria);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedList = useMemo(() => {
    let filteredList = [...lista];
    if (searchQuery) {
      filteredList = filteredList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.date.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "date") {
      if (sortOrder === "asc") {
        return filteredList.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        return filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    } else if (
      sortBy === "name" ||
      sortBy === "category" ||
      sortBy === "place" ||
      sortBy === "city"
    ) {
      if (sortOrder === "asc") {
        return filteredList.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        return filteredList.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
  }, [sortBy, sortOrder, lista, searchQuery]);

  useEffect(() => {
    sortedList.length !== 0 && inputRef.current.focus();
  }, []);

  const buttons = (
    <>
      <button onClick={() => handleSortClick("date")}>
        Sort by date {sortBy === "date" && (sortOrder === "asc" ? "↓" : "↑")}
      </button>
      <button onClick={() => handleSortClick("name")}>
        Sort by name {sortBy === "name" && (sortOrder === "asc" ? "↓" : "↑")}
      </button>
      <button onClick={() => handleSortClick("city")}>
        Sort by city {sortBy === "city" && (sortOrder === "asc" ? "↓" : "↑")}
      </button>
    </>
  );

  return (
    <>
      <input
        id="search"
        type="text"
        ref={inputRef}
        onChange={(e) => {
          e.preventDefault();
          setSearchQuery(e.target.value);
        }}
        placeholder="Search by name, place, city, category or date"
      />
      <div className="sort">{sortedList.length !== 0 && buttons}</div>
      {sortedList.map((x, el) => (
        <Class obj={x} key={el} role={role} />
      ))}
    </>
  );
};

export default ListProducts;
