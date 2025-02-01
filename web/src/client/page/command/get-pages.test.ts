import type { PageClientConfig } from "@/client/page";
import { GetPages } from "@/client/page/command/get-pages";
import type { Page } from "@/schema/page";
import { beforeEach, describe, expect, it } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("GetPages", () => {
  const config: Required<PageClientConfig> = {
    baseUrl: "http://localhost/api",
  };

  const page: Page = {
    path: "/test",
    title: "Test Page 1",
    content: "This is test page 1.",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch pages with filter", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([page]));

    const getPages = new GetPages({ filter: { path: "/test" } });
    const { payload } = await getPages.execute(config);

    await expect(payload?.()).resolves.toEqual([page]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/api/pages/?path=%2Ftest&limit=10",
    );
  });

  it("should handle fetch errors", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    const getPages = new GetPages({ filter: { path: "/test" } });

    await expect(getPages.execute(config)).rejects.toThrow("Failed to fetch");
  });

  it("should fetch pages with limit", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([page]));

    const getPages = new GetPages({ filter: { path: "/test" }, limit: 1 });
    const { payload } = await getPages.execute(config);

    await expect(payload?.()).resolves.toEqual([page]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/api/pages/?path=%2Ftest&limit=1",
    );
  });

  it("should handle invalid limit", () => {
    const getPages = new GetPages({ filter: { path: "/test" }, limit: 0 });

    expect(() => getPages.execute(config)).rejects.toThrow(
      "Limit must be an integer greater than 0.",
    );
  });
});
