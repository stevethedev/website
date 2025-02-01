import PageClient, { GetPages } from "@/client/page";
import TwoColumnLayout from "@/component/layout/two-column";
import Article from "@/component/ui/article";
import Markdown from "@/component/ui/markdown";
import type { Page } from "@/schema/page";
import { type ReactElement, useEffect, useState } from "react";

export interface HomePageProps {
  readonly apiUrl: string;
}

export default function HomePage({ apiUrl }: HomePageProps): ReactElement {
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => {
    const pageClient = new PageClient({ baseUrl: apiUrl });
    const getPageCommand = new GetPages({
      filter: {
        path: "/", // This is the home page
      },
    });
    void pageClient
      .send(getPageCommand)
      .then((getPageOutput) => getPageOutput.payload())
      .then(([page = null]) => page)
      .then(setPage);
  }, [setPage]);

  return (
    <TwoColumnLayout>
      <Article>
        {page?.title}
        <Markdown>{page?.content}</Markdown>
      </Article>
    </TwoColumnLayout>
  );
}
