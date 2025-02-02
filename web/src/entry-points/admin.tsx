import Admin from "@/app/admin";
import { createRoot } from "react-dom/client";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
createRoot(rootElement).render(<Admin />);
