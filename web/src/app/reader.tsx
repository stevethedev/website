import GenericPage from "@/component/page/generic";
import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

export default function Reader(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          index
          element={<GenericPage apiUrl="http://localhost/api" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
