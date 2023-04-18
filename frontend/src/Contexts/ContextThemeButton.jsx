import { useTheme } from "./ThemeContext";

const ContextThemeButton = (props) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙" : "☀️ "}
    </button>
  );
};

export default ContextThemeButton;
