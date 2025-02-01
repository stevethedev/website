import { describe, expect, it } from "@jest/globals";
import getClassName from "./class-name";

describe("getClassName", () => {
  it("should return an empty string for no arguments", () => {
    expect(getClassName()).toBe("");
  });

  it("should return a single class name", () => {
    expect(getClassName("class1")).toBe("class1");
  });

  it("should concatenate multiple class names", () => {
    expect(getClassName("class1", "class2")).toBe("class1 class2");
  });

  it("should handle null and undefined values", () => {
    expect(getClassName("class1", null, "class2", undefined)).toBe(
      "class1 class2",
    );
  });

  it("should handle an array of class names", () => {
    expect(getClassName(["class1", "class2"])).toBe("class1 class2");
  });

  it("should handle nested arrays of class names", () => {
    expect(getClassName(["class1", ["class2", "class3"]])).toBe(
      "class1 class2 class3",
    );
  });

  it("should handle an object with boolean values", () => {
    expect(getClassName({ class1: true, class2: false, class3: true })).toBe(
      "class1 class3",
    );
  });

  it("should handle a mix of strings, arrays, and objects", () => {
    expect(
      getClassName(
        "class1",
        [
          "class2",
          {
            class3: true,
            class4: false,
          },
        ],
        "class5",
      ),
    ).toBe("class1 class2 class3 class5");
  });
});
