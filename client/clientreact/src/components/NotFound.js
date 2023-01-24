import { useLocation } from "react-router-dom";

export function NotFound() {
  let location = useLocation();
  console.log(location);
  return (
    <div>
      <h1>Nie znaleziono elementu: {location.pathname}</h1>
    </div>
  );
}
