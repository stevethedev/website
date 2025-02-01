export interface PageClientConfig {
  readonly baseUrl?: string;
}

export class PageClientConfigReader {
  readonly #baseUrl?: string;

  constructor(config: PageClientConfig) {
    this.#baseUrl = config.baseUrl;
  }

  read(): Required<PageClientConfig> {
    return {
      baseUrl: this.#baseUrl ?? "/api",
    };
  }
}
