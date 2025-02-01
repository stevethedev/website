import HomePage from "@/component/page/home";
import Logo from "@/component/ui/logo";
import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

export default function Reader(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage apiUrl="http://localhost/api" />} />
        <Route path="logo" element={<Logo />} />
      </Routes>
    </BrowserRouter>
  );
}
