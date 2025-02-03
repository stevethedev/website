import { AccountClientConfigReader } from "@/client/account/config";
import { type Account } from "@/schema/account";
import { beforeEach, describe, expect, it } from "@jest/globals";

import fetchMock from "jest-fetch-mock";
import { WhoamiCommand } from "./whoami";

fetchMock.enableMocks();

describe("Login Command", () => {
  const token: string = "test-token";
  const config = new AccountClientConfigReader({
    baseUrl: "http://localhost/admin/api",
  }).read();

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should return account", async () => {
    const account: Account = {
      id: 1,
      username: "test",
      displayName: "Test User",
    };
    fetchMock.mockResponseOnce(JSON.stringify(account));

    const command = new WhoamiCommand({ token });
    const result = await command.execute(config);
    await expect(result.payload?.()).resolves.toEqual(account);
  });

  it("should return metadata", async () => {
    fetchMock.mockResponseOnce("", { status: 401 });

    const command = new WhoamiCommand({ token });
    const result = await command.execute(config);
    expect(result.$metadata.status).toEqual(401);
  });

  it("should return metadata", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    const command = new WhoamiCommand({ token });
    const result = await command.execute(config);
    expect(result.$metadata.status).toEqual(500);
  });
});
