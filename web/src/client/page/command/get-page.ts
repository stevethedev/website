import type { Command } from "@/client";
import type { PageClientConfig } from "@/client/page/config";
import type { Page } from "@/schema/page";
import { Convert } from "@/schema/page";

export interface GetPageCommandInput {
  readonly id: string;
}

export interface GetPageCommandOutput {
  payload?: () => Promise<Page>;
}

export class GetPage
  implements Command<PageClientConfig, GetPageCommandOutput>
{
  readonly #targetPath: string;

  constructor(getPageCommandInput: GetPageCommandInput) {
    this.#targetPath = `pages/${getPageCommandInput.id}/`;
  }

  async execute(config: Readonly<Required<PageClientConfig>>) {
    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    const response = await fetch(url.toString());

    const payload = async () => await response.text().then(Convert.toPage);

    return { payload };
  }
}
