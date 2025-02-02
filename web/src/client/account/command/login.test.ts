import type { AccountClientConfig } from "@/client/account/config";
import { AccountClientConfigReader } from "@/client/account/config";

import { Convert as ConvertLogin } from "@/schema/login";

import { type LoginResponse } from "@/schema/login-response";
import { beforeEach, describe, expect, it } from "@jest/globals";

import fetchMock from "jest-fetch-mock";
import { Login } from "./login";

fetchMock.enableMocks();

describe("Login Command", () => {
  const config: AccountClientConfig = { baseUrl: "http://localhost/admin/api" };

  const loginInput = { username: "testuser", password: "testpass" };

  const loginResponse: LoginResponse = {
    jwt: "testjwt",
    expires: "2023-12-31T23:59:59Z",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should send login request and return response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(loginResponse));

    const loginCommand = new Login(loginInput);
    const output = await loginCommand.execute(
      new AccountClientConfigReader(config).read(),
    );

    await expect(output.payload?.()).resolves.toEqual(loginResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost/admin/api/login/",
      {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: ConvertLogin.loginToJson(loginInput),
      },
    );
  });

  it("should return error if response is not JSON", async () => {
    fetchMock.mockResponseOnce("Not JSON");

    const loginCommand = new Login(loginInput);

    const output = await loginCommand.execute(
      new AccountClientConfigReader(config).read(),
    );

    await expect(output.payload?.()).rejects.toThrowError();
  });

  it("should return error if response is not valid JSON", async () => {
    fetchMock.mockResponseOnce("{}");

    const loginCommand = new Login(loginInput);

    const output = await loginCommand.execute(
      new AccountClientConfigReader(config).read(),
    );

    await expect(output.payload?.()).rejects.toThrowError();
  });

  it("should return error if HTTP status is not 200", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(loginResponse), { status: 401 });

    const loginCommand = new Login(loginInput);

    const output = loginCommand.execute(
      new AccountClientConfigReader(config).read(),
    );

    await expect(output).resolves.toEqual({
      $metadata: { status: 401 },
    });
  });

  it("should return error if fetch fails", async () => {
    fetchMock.mockRejectOnce(new Error("Network Error"));

    const loginCommand = new Login(loginInput);

    const output = loginCommand.execute(
      new AccountClientConfigReader(config).read(),
    );

    await expect(output).rejects.toThrowError("Network Error");
  });
});
