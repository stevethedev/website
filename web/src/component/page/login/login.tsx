import AccountClient, { Login } from "@/client/account";
import LoginLayout from "@/component/layout/login";
import type { LoginFormValues } from "@/component/ui/login-form";
import LoginForm from "@/component/ui/login-form";
import type { LoginResponse } from "@/schema/login-response";
import { type ReactElement, useCallback, useState } from "react";

export interface LoginPageProps {
  readonly apiUrl: string;
  readonly setJwt: (jwtData: null | LoginResponse) => void;
}

export default function LoginPage({
  apiUrl,
  setJwt,
}: LoginPageProps): ReactElement {
  const [shake, setShake] = useState(false);
  const onLogin = useCallback(
    (loginFormValues: LoginFormValues) => {
      const client = new AccountClient({ baseUrl: apiUrl });
      client
        .send(new Login(loginFormValues))
        .then(async ({ payload }) => (await payload?.()) ?? null)
        .then((value) => {
          if (value === null) {
            setShake(true);
          }
          setJwt(value);
        });
    },
    [apiUrl, setJwt],
  );

  return (
    <LoginLayout>
      <LoginForm
        shake={shake}
        onInput={() => setShake(false)}
        onLogin={onLogin}
      />
    </LoginLayout>
  );
}
