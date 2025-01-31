import { GetPages } from "@/client/page/command/get-pages";
import type { Page } from "@/schema/page";
import { beforeEach, describe, expect, it } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("GetPages", () => {
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
    const { payload } = await getPages.execute();

    await expect(payload?.()).resolves.toEqual([page]);
    expect(fetchMock).toHaveBeenCalledWith("/api/pages/?path=%2Ftest");
  });

  it("should handle fetch errors", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    const getPages = new GetPages({ filter: { path: "/test" } });

    await expect(getPages.execute()).rejects.toThrow("Failed to fetch");
  });
});
