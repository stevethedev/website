import { useState } from "react";

export default function useLocalStorage(
  localStorageKey: string,
): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState(localStorage.getItem(localStorageKey));
  return [
    value,
    (newValue) => {
      if (newValue) {
        localStorage.setItem(localStorageKey, newValue);
      } else {
        localStorage.removeItem(localStorageKey);
      }
      setValue(newValue);
    },
  ];
}
