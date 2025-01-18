import example from "@/controller/example";
import { describe, it, expect } from "@jest/globals";

describe("example", () => {
  it("should return 'example'", () => {
    expect(window).toBeDefined();
    expect(example()).toBe(window);
  });
});
