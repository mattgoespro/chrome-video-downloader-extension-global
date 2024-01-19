import { createRoot } from "react-dom/client";
import { SidePanel } from "./components/sidePanel";

window.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  createRoot(rootElement).render(<SidePanel />);
});
