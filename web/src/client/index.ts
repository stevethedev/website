export interface Command<TConfig, TOutput> {
  execute(config: Readonly<TConfig>): Promise<TOutput>;
}

export class Client<TConfig> {
  readonly #config: Readonly<TConfig>;

  constructor(config: Readonly<TConfig>) {
    this.#config = config;
  }

  async send<TOutput>(command: Command<TConfig, TOutput>): Promise<TOutput> {
    return await command.execute(this.#config);
  }
}
