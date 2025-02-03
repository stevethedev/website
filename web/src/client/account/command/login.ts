import type { Command, MetadataResponse } from "@/client";
import type { AccountClientConfig } from "@/client/account/config";
import { Convert as ConvertLogin } from "@/schema/login";
import {
  Convert as ConvertResponse,
  type LoginResponse,
} from "@/schema/login-response";

export interface LoginCommandInput {
  readonly username: string;
  readonly password: string;
}

export interface LoginCommandOutput extends MetadataResponse {
  payload?: () => Promise<LoginResponse>;
}

export class LoginCommand
  implements Command<AccountClientConfig, LoginCommandOutput>
{
  readonly #targetPath: string;
  readonly #username: string;
  readonly #password: string;

  constructor(loginCommandInput: LoginCommandInput) {
    this.#targetPath = "login/";
    this.#username = loginCommandInput.username;
    this.#password = loginCommandInput.password;
  }

  async execute(
    config: Readonly<Required<AccountClientConfig>>,
  ): Promise<LoginCommandOutput> {
    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: ConvertLogin.loginToJson({
        username: this.#username,
        password: this.#password,
      }),
    });

    const $metadata = {
      status: response.status,
    };

    if (response.status !== 200) {
      return { $metadata };
    }

    const payload = async () =>
      await response.text().then(ConvertResponse.toLoginResponse);

    return { $metadata, payload };
  }
}
