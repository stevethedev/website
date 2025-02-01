import type { Command } from "@/client";
import type { PageClientConfig } from "@/client/page";
import { Convert, type Page } from "@/schema/page";

export interface GetPagesCommandInput {
  readonly filter: Readonly<Partial<Page>>;
  readonly limit?: number;
}

export interface GetPagesCommandOutput {
  payload?: () => Promise<Page[]>;
}

export class GetPages
  implements Command<PageClientConfig, GetPagesCommandOutput>
{
  readonly #searchParams: [string, string][];
  readonly #targetPath: string;
  readonly #limit: number;

  constructor(getPagesCommandInput: GetPagesCommandInput) {
    this.#targetPath = "pages/";
    this.#searchParams = Object.entries(getPagesCommandInput.filter).map(
      ([key, value]): [string, string] => [key, String(value)],
    );
    this.#limit = getPagesCommandInput.limit ?? 10;
  }

  async execute(config: Readonly<Required<PageClientConfig>>) {
    if (!Number.isInteger(this.#limit) || this.#limit < 1) {
      throw new Error("Limit must be an integer greater than 0.");
    }

    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    this.#searchParams.forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );

    if (this.#limit) {
      url.searchParams.set("limit", String(this.#limit));
    }

    const response = await fetch(url.toString());

    const payload = async (): Promise<Page[]> =>
      await response.text().then(Convert.toPageArray);

    return { payload };
  }
}
