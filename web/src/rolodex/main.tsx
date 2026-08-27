import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { initTheme } from "../shared/theme";
import { initLocale } from "../shared/locale";
import "./styles.css";

initTheme();
initLocale();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/rolodex">
    <App />
  </BrowserRouter>,
);
