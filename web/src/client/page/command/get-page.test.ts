import { GetPage } from "@/client/page/command/get-page";
import type { PageClientConfig } from "@/client/page/config";
import type { Page } from "@/schema/page";
import { beforeEach, describe, expect, it } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("GetPage", () => {
  const config: Required<PageClientConfig> = {
    baseUrl: "http://localhost/api",
  };

  const page: Page = {
    path: "/test",
    title: "Test Page",
    content: "This is a test page.",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch a page by id", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(page));

    const getPage = new GetPage({ id: "1" });
    const { payload } = await getPage.execute(config);

    await expect(payload?.()).resolves.toEqual(page);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost/api/pages/1/");
  });

  it("should handle fetch errors", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    const getPage = new GetPage({ id: "1" });

    await expect(getPage.execute(config)).rejects.toThrow("Failed to fetch");
  });
});
