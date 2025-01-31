import { Convert, type Page } from "@/schema/page";

export interface GetPagesCommandInput {
  readonly filter: Readonly<Partial<Page>>;
}

export interface GetPagesCommandOutput {
  payload?: () => Promise<Page[]>;
}

export class GetPages {
  readonly #filter: [string, string][];

  constructor(getPagesCommandInput: GetPagesCommandInput) {
    this.#filter = Object.entries(getPagesCommandInput.filter).map(
      ([key, value]): [string, string] => [key, String(value)],
    );
  }

  async execute() {
    const searchParams = new URLSearchParams(this.#filter).toString();
    const response = await fetch(`/api/pages/?${searchParams}`);

    const payload = async (): Promise<Page[]> =>
      await response.text().then(Convert.toPageArray);

    return { payload };
  }
}
