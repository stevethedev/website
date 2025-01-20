import { createRoot } from "react-dom/client";
import Admin from "@/app/admin";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
createRoot(rootElement).render(Admin());
