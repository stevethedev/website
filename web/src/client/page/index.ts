import { Convert, type Page } from "@/schema/page";
import { Client, type Command } from "../";

export interface PageClientConfig {
  readonly baseUrl?: string;
}

export default class PageClient extends Client<PageClientConfig> {}

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
