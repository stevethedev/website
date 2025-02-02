import AdminDashboardPage from "@/component/page/admin-dashboard";
import AdminPageListPage from "@/component/page/admin-page-list";
import LoginPage from "@/component/page/login";
import type { LoginResponse } from "@/schema/login-response";
import { type ReactNode, useCallback, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const LOCAL_STORAGE_JWT = "jwt";

export default function Reader(): ReactNode {
  const [jwt, setJwt] = useState<string | null>(
    localStorage.getItem(LOCAL_STORAGE_JWT),
  );
  const [, setExpires] = useState<Date | null>(null);

  const onLogin = useCallback((loginResponse: LoginResponse | null) => {
    setJwt(loginResponse?.jwt ?? null);
    setExpires(loginResponse?.expires ? new Date(loginResponse.expires) : null);
  }, []);
  const apiUrl = "http://localhost/admin/api";

  return (
    <BrowserRouter basename="/admin">
      {jwt ? (
        <Routes>
          <Route index element={<AdminDashboardPage apiUrl={apiUrl} />} />
          <Route
            path="/pages"
            element={<AdminPageListPage apiUrl={apiUrl} />}
          />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="*"
            index
            element={<LoginPage apiUrl={apiUrl} setJwt={onLogin} />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}
