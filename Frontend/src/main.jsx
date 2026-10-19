import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EventPage from "./pages/EventPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventPage />
  </StrictMode>,
);
