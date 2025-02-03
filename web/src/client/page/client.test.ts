import type { Page } from "@/schema/page";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import type { GetPagesCommandInput } from "./command/get-pages";
import { GetPagesCommand } from "./command/get-pages";

describe("Client", () => {
  const config = { baseUrl: "http://localhost/api" };

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.resetMocks();
  });

  it("should construct with filter", () => {
    const input: GetPagesCommandInput = { filter: { title: "test" } };
    const getPages = new GetPagesCommand(input);
    expect(getPages).toBeDefined();
  });

  it("should fetch pages with correct query parameters", async () => {
    const input: GetPagesCommandInput = { filter: { path: "/test" } };
    const getPages = new GetPagesCommand(input);
    fetchMock.mockOnce("[]");

    const result = await getPages.execute(config);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/api/pages/?path=%2Ftest",
    );
    expect(result.payload).toBeDefined();
  });

  it("should convert response to Page array", async () => {
    const input: GetPagesCommandInput = { filter: { path: "/test" } };
    const getPages = new GetPagesCommand(input);

    const mockPages: Page[] = [
      { path: "/test", title: "test", content: "content" },
    ];
    fetchMock.mockOnce(JSON.stringify(mockPages));
    const result = await getPages.execute(config);
    await expect(result.payload?.()).resolves.toEqual(mockPages);
  });
});
