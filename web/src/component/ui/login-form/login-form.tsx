import Button, { Variant } from "@/component/ui/button";
import Input from "@/component/ui/input";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { FormEventHandler, HTMLAttributes, ReactElement } from "react";
import { useCallback, useState } from "react";
import styles from "./login-form.module.css";

export interface LoginFormValues {
  readonly username: string;
  readonly password: string;
}

export interface LoginFormProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  readonly className?: ClassName;
  readonly onLogin?: (loginFormValues: LoginFormValues) => void;
  readonly shake?: boolean;
}

export default function LoginForm({
  children,
  className,
  onLogin,
  shake,
  ...args
}: LoginFormProps): ReactElement {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = useCallback<
    FormEventHandler<HTMLButtonElement | HTMLFormElement>
  >(
    (event) => {
      event.preventDefault();
      onLogin?.({ username, password });
    },
    [username, password],
  );

  return (
    <form
      action="#"
      method="post"
      {...args}
      onSubmit={handleSubmit}
      className={getClassName(styles["login-form"], className, {
        [styles.shake]: shake,
      })}
    >
      {children}
      <Input value={username} setValue={setUsername}>
        Username
      </Input>
      <Input value={password} setValue={setPassword} type="password">
        Password
      </Input>
      <Button
        type="submit"
        variant={Variant.Primary}
        className={styles.submit}
        onSubmit={handleSubmit}
      >
        Login
      </Button>
    </form>
  );
}
