import { beforeEach, describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import useLocalStorage from "./use-local-storage";

describe("useLocalStorage", () => {
  const localStorageKey = "testKey";

  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the initial value from localStorage", () => {
    localStorage.setItem(localStorageKey, "initialValue");
    const { result } = renderHook(() => useLocalStorage(localStorageKey));
    expect(result.current[0]).toBe("initialValue");
  });

  it("should set a new value in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(localStorageKey));
    act(() => {
      result.current[1]("newValue");
    });
    expect(localStorage.getItem(localStorageKey)).toBe("newValue");
    expect(result.current[0]).toBe("newValue");
  });

  it("should remove the value from localStorage when set to null", () => {
    localStorage.setItem(localStorageKey, "initialValue");
    const { result } = renderHook(() => useLocalStorage(localStorageKey));
    act(() => {
      result.current[1](null);
    });
    expect(localStorage.getItem(localStorageKey)).toBeNull();
    expect(result.current[0]).toBeNull();
  });
});
