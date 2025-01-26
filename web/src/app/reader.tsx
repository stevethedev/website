import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Logo from "@/component/ui/logo/logo";
import HomePage from "@/component/page/home/home";

export default function Reader(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="logo" element={<Logo />} />
      </Routes>
    </BrowserRouter>
  );
}
