import getClassName, { type ClassName } from "@/utils/class-name";
import type {
  ChangeEvent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { useCallback, useId } from "react";
import styles from "./input.module.css";

export interface InputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  readonly id?: string;
  readonly name?: string;
  readonly children?: ReactNode;
  readonly className?: ClassName;
  readonly value?: string;
  readonly setValue?: (value: string) => void;
  readonly type?: "text" | "password";
}

export default function Input({
  children,
  name,
  className,
  value,
  setValue,
  type = "text",
  ...props
}: InputProps): ReactElement {
  const inputId = useId();
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue?.(event.target.value);
    },
    [setValue],
  );
  return (
    <div {...props} className={getClassName(styles.container, className)}>
      <label className={styles.label} htmlFor={inputId}>
        {children}
      </label>
      <input
        className={styles.input}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
      />
    </div>
  );
}
