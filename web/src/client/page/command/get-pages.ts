import type { Command, MetadataResponse } from "@/client";
import type { PageClientConfig } from "@/client/page";
import { Convert, type Page } from "@/schema/page";
import isNumber from "@std-types/is-number";

export interface GetPagesCommandInput {
  readonly filter: Readonly<Partial<Page>>;
  readonly limit?: number;
  readonly offset?: number;
}

export interface GetPagesCommandOutput extends MetadataResponse {
  payload?: () => Promise<Page[]>;
}

export class GetPagesCommand
  implements Command<PageClientConfig, GetPagesCommandOutput>
{
  readonly #searchParams: [string, string][];
  readonly #targetPath: string;
  readonly #limit?: number;
  readonly #offset?: number;

  constructor(getPagesCommandInput: GetPagesCommandInput) {
    this.#targetPath = "pages/";
    this.#searchParams = Object.entries(getPagesCommandInput.filter).map(
      ([key, value]): [string, string] => [key, String(value)],
    );
    this.#limit = getPagesCommandInput.limit;
    this.#offset = getPagesCommandInput.offset;
  }

  async execute(
    config: Readonly<Required<PageClientConfig>>,
  ): Promise<GetPagesCommandOutput> {
    const baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    const url = new URL(this.#targetPath, baseUrl);
    this.#searchParams.forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );

    if (isNumber(this.#limit)) {
      if (!Number.isInteger(this.#limit) || this.#limit < 1) {
        throw new Error("Limit must be an integer greater than 0.");
      }

      url.searchParams.set("limit", String(this.#limit));
    }

    if (isNumber(this.#offset)) {
      if (!Number.isInteger(this.#offset) || this.#offset < 0) {
        throw new Error(
          "Offset must be an integer greater than or equal to 0.",
        );
      }

      url.searchParams.set("offset", String(this.#offset));
    }

    const response = await fetch(url.toString());

    const $metadata = {
      status: response.status,
    };

    if (!response.ok) {
      return { $metadata };
    }

    const payload = async (): Promise<Page[]> =>
      await response.text().then(Convert.toPageArray);

    return { $metadata, payload };
  }
}
