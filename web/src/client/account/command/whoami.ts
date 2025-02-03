import type { Command, MetadataResponse } from "@/client";
import type { AccountClientConfig } from "@/client/account/config";
import { type Account, Convert as ConvertAccount } from "@/schema/account";

export interface WhoamiCommandInput {
  readonly token: string;
}

export interface WhoamiCommandOutput extends MetadataResponse {
  payload?: () => Promise<Account>;
}

export class WhoamiCommand
  implements Command<AccountClientConfig, WhoamiCommandOutput>
{
  readonly #targetPath: string;
  readonly #token: string;

  constructor(loginCommandInput: WhoamiCommandInput) {
    this.#targetPath = "login/whoami/";
    this.#token = loginCommandInput.token;
  }

  async execute(
    config: Readonly<Required<AccountClientConfig>>,
  ): Promise<WhoamiCommandOutput> {
    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    const response = await fetch(url.toString(), {
      method: "GET",
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
      await response.text().then(ConvertAccount.toAccount);

    return { $metadata, payload };
  }
}
