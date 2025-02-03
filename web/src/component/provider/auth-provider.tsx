import AccountClient, { WhoamiCommand } from "@/client/account";
import { RenewCommand } from "@/client/account/command/renew";
import useInterval from "@/hook/use-interval";
import useLocalStorage from "@/hook/use-local-storage";
import { type Account } from "@/schema/account";
import { type LoginResponse } from "@/schema/login-response";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

const AuthContext = createContext<Authentication | undefined>(undefined);

export interface AuthProviderProps {
  children?: ReactNode;
  unauthorized?: ReactNode;
  apiUrl: string;
  jwtLocalStorageKey: string;
}

export interface Authentication {
  token: string | null;
  login: (jwtData: null | LoginResponse) => void;
  logout: () => void;
  user: Account | null;
}

export default function AuthProvider({
  apiUrl,
  children,
  unauthorized,
  jwtLocalStorageKey,
}: AuthProviderProps): ReactElement {
  const [token, setToken] = useLocalStorage(jwtLocalStorageKey);
  const [expires, setExpires] = useState<number | null>(null);
  const [user, setUser] = useState<Account | null>(null);

  const logout: () => void = useCallback(() => {
    setToken(null);
    setExpires(null);
    setUser(null);
  }, [setToken, setExpires, setUser]);

  const getUser = useCallback(
    async (token: string) => {
      const client = new AccountClient({ baseUrl: apiUrl });
      const whoamiCommand = new WhoamiCommand({ token });
      const whoamiResponse = await client.send(whoamiCommand);

      const whoamiPayload = (await whoamiResponse.payload?.()) ?? null;
      if (whoamiPayload === null) {
        logout();
        return;
      }

      setUser(whoamiPayload);
    },
    [apiUrl, logout],
  );

  const extendLogin = useCallback(
    async (token: string) => {
      if (!token) {
        logout();
        return;
      }
      const client = new AccountClient({ baseUrl: apiUrl });
      const renewCommand = new RenewCommand({ token });
      const renewResponse = await client.send(renewCommand);
      const renewPayload = (await renewResponse.payload?.()) ?? null;
      if (renewPayload === null) {
        logout();
        return;
      }
      setToken(renewPayload.jwt);
      setExpires(new Date(renewPayload.expires).getTime());
    },
    [apiUrl],
  );

  useInterval(
    1000,
    async () => {
      const now = Date.now();
      if (!expires || now > expires || !token) {
        logout();
        return;
      }

      if (now > expires - 60_000) {
        await extendLogin(token);
      }

      if (!user) {
        await getUser(token);
      }
    },
    [expires, token, setToken, setExpires],
  );

  const login = useCallback(
    async (loginResponse: null | LoginResponse) => {
      if (!loginResponse) {
        logout();
        return;
      }

      const { jwt, expires: expiresString } = loginResponse;
      const newToken = jwt ?? null;
      const newExpires = expiresString ? new Date(expiresString) : null;

      await getUser(newToken);
      setToken(newToken);
      setExpires(newExpires?.getTime() ?? null);
    },
    [apiUrl, setToken, setExpires, setUser],
  );

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {token ? children : unauthorized}
    </AuthContext.Provider>
  );
}

export const useAuth = (): Authentication => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AnonymousGuard({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const { token } = useAuth();
  return token ? null : <>{children}</>;
}

export function AuthGuard({ children }: { children: ReactNode }): ReactNode {
  const { token } = useAuth();
  return token ? <>{children}</> : null;
}
