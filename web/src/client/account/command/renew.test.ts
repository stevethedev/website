import { AccountClientConfigReader } from "@/client/account/config";
import type { LoginResponse } from "@/schema/login-response";
import { beforeEach, describe, expect, it } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { RenewCommand } from "./renew";

fetchMock.enableMocks();

describe("RenewCommand", () => {
  const config = new AccountClientConfigReader({
    baseUrl: "http://localhost/admin/api",
  }).read();
  const token = "test-token";
  const renewCommandInput = { token };
  const renewResponse: LoginResponse = {
    jwt: "new-jwt",
    expires: "2023-12-31T23:59:59Z",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should send renew request and return response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(renewResponse));

    const renewCommand = new RenewCommand(renewCommandInput);
    const output = await renewCommand.execute(config);

    await expect(output.payload?.()).resolves.toEqual(renewResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/admin/api/login/renew/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });

  it("should return error if response is not JSON", async () => {
    fetchMock.mockResponseOnce("Not JSON");

    const renewCommand = new RenewCommand(renewCommandInput);
    const output = await renewCommand.execute(config);

    await expect(output.payload?.()).rejects.toThrowError();
  });

  it("should return error if response is not valid JSON", async () => {
    fetchMock.mockResponseOnce("{}");

    const renewCommand = new RenewCommand(renewCommandInput);
    const output = await renewCommand.execute(config);

    await expect(output.payload?.()).rejects.toThrowError();
  });

  it("should return error if HTTP status is not 200", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(renewResponse), { status: 401 });

    const renewCommand = new RenewCommand(renewCommandInput);
    const output = await renewCommand.execute(config);

    expect(output.$metadata.status).toBe(401);
  });

  it("should return error if fetch fails", async () => {
    fetchMock.mockRejectOnce(new Error("Network Error"));

    const renewCommand = new RenewCommand(renewCommandInput);
    const output = renewCommand.execute(config);

    await expect(output).rejects.toThrowError("Network Error");
  });
});
