import { Client } from "@/client";
import { type AccountClientConfig, AccountClientConfigReader } from "./config";

export default class AccountClient extends Client<AccountClientConfig> {
  constructor(config: AccountClientConfig) {
    const reader = new AccountClientConfigReader(config);
    super(reader.read());
  }
}
