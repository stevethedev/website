import AdminDashboardPage from "@/component/page/admin-dashboard";
import AdminPageListPage from "@/component/page/admin-page-list";
import LoginPage from "@/component/page/login";
import Authenticator, {
  AuthGuard,
  useAuth,
} from "@/component/provider/auth-provider";
import { type ReactNode, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";

export default function AdminApp(): ReactNode {
  const apiUrl = "http://localhost/admin/api";
  const basename = "/admin";
  const jwtLocalStorageKey = "jwt";

  return (
    <Authenticator
      apiUrl={apiUrl}
      jwtLocalStorageKey={jwtLocalStorageKey}
      unauthorized={<LoginPage apiUrl={apiUrl} />}
    >
      <BrowserRouter basename={basename}>
        <AuthGuard>
          <Routes>
            <Route
              index
              path="*"
              element={<AdminDashboardPage apiUrl={apiUrl} />}
            />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/pages"
              element={<AdminPageListPage apiUrl={apiUrl} />}
            />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </Authenticator>
  );
}

function LogoutPage(): ReactNode {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout]);
  return null;
}
