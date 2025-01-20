import { createRoot } from "react-dom/client";
import Reader from "@/app/reader";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
createRoot(rootElement).render(Reader());
