import { Client } from "@/client";
import { type PageClientConfig, PageClientConfigReader } from "./config";

export default class PageClient extends Client<PageClientConfig> {
  constructor(config: PageClientConfig) {
    const reader = new PageClientConfigReader(config);
    super(reader.read());
  }
}
