import type { Page } from "@/schema/page";
import { describe, expect, it, jest } from "@jest/globals";
import type { GetPagesCommandInput } from "./command/get-pages";
import { GetPages } from "./command/get-pages";

describe("Client", () => {
  const config = { baseUrl: "http://localhost/api" };

  it("should construct with filter", () => {
    const input: GetPagesCommandInput = { filter: { title: "test" } };
    const getPages = new GetPages(input);
    expect(getPages).toBeDefined();
  });

  it("should fetch pages with correct query parameters", async () => {
    const input: GetPagesCommandInput = { filter: { path: "/test" } };
    const getPages = new GetPages(input);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("[]"),
      } as Response),
    );

    const result = await getPages.execute(config);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost/api/pages/?path=%2Ftest",
    );
    expect(result.payload).toBeDefined();
  });

  it("should convert response to Page array", async () => {
    const input: GetPagesCommandInput = { filter: { path: "/test" } };
    const getPages = new GetPages(input);

    const mockPages: Page[] = [
      { path: "/test", title: "test", content: "content" },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(JSON.stringify(mockPages)),
      } as Response),
    );

    const result = await getPages.execute(config);
    const pages = await result.payload();
    expect(pages).toEqual(mockPages);
  });
});
