export interface AccountClientConfig {
  readonly baseUrl?: string;
}

export class AccountClientConfigReader {
  readonly #baseUrl?: string;

  constructor(config: AccountClientConfig) {
    this.#baseUrl = config.baseUrl;
  }

  read(): Required<AccountClientConfig> {
    return {
      baseUrl: this.#baseUrl ?? "/api",
    };
  }
}
