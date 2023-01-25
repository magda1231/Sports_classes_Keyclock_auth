import { useTheme } from "./ThemeContext";
import { useContext } from "react";

const ContextThemeButton = (props) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      class="theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙" : "☀️ "}
    </button>
  );
};

export default ContextThemeButton;
