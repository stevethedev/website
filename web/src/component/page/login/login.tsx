import AccountClient, { LoginCommand } from "@/client/account";
import LoginLayout from "@/component/layout/login";
import { useAuth } from "@/component/provider/auth-provider";
import type { LoginFormValues } from "@/component/ui/login-form";
import LoginForm from "@/component/ui/login-form";
import { type ReactElement, useCallback, useState } from "react";

export interface LoginPageProps {
  readonly apiUrl: string;
}

export default function LoginPage({ apiUrl }: LoginPageProps): ReactElement {
  const { login: onLogin } = useAuth();
  const [shake, setShake] = useState(false);
  const onLoginInternal = useCallback(
    (loginFormValues: LoginFormValues) => {
      const client = new AccountClient({ baseUrl: apiUrl });
      client
        .send(new LoginCommand(loginFormValues))
        .then(async ({ payload }) => (await payload?.()) ?? null)
        .then((value) => {
          if (value === null) {
            setShake(true);
          }
          onLogin(value);
        });
    },
    [apiUrl, onLogin],
  );

  return (
    <LoginLayout>
      <LoginForm
        shake={shake}
        onInput={() => setShake(false)}
        onLogin={onLoginInternal}
      />
    </LoginLayout>
  );
}
