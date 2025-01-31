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
  readonly #id: string;

  constructor(getPageCommandInput: GetPageCommandInput) {
    this.#id = getPageCommandInput.id;
  }

  async execute(config: Readonly<PageClientConfig>) {
    const response = await fetch(`${config.baseUrl}/pages/${this.#id}/`);

    const payload = async () => await response.text().then(Convert.toPage);

    return { payload };
  }
}
