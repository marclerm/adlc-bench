import { createRoot } from "react-dom/client";
import App from "./App";
import { initTheme } from "../shared/theme";
import { initLocale } from "../shared/locale";
import "./styles.css";

initTheme();
initLocale();

createRoot(document.getElementById("root")!).render(<App />);
