import type { Command, MetadataResponse } from "@/client";
import type { AccountClientConfig } from "@/client/account/config";
import {
  Convert as ConvertResponse,
  type LoginResponse,
} from "@/schema/login-response";

export interface RenewCommandInput {
  readonly token: string;
}

export interface RenewCommandOutput extends MetadataResponse {
  payload?: () => Promise<LoginResponse>;
}

export class RenewCommand
  implements Command<AccountClientConfig, RenewCommandOutput>
{
  readonly #targetPath: string;
  readonly #token: string;

  constructor(renewCommandInput: RenewCommandInput) {
    this.#targetPath = "login/renew/";
    this.#token = renewCommandInput.token;
  }

  async execute(
    config: Readonly<Required<AccountClientConfig>>,
  ): Promise<RenewCommandOutput> {
    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#token}`,
      },
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
