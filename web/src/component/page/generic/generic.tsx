import PageClient, { GetPages } from "@/client/page";
import TwoColumnLayout from "@/component/layout/two-column";
import Article from "@/component/ui/article";
import Markdown from "@/component/ui/markdown";
import type { Page } from "@/schema/page";
import { type ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router";

export interface PageProps {
  readonly apiUrl: string;
}

export default function GenericPage({ apiUrl }: PageProps): ReactElement {
  const { pathname } = useLocation();
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => {
    const pageClient = new PageClient({ baseUrl: apiUrl });
    const getPageCommand = new GetPages({
      filter: {
        path: pathname, // This is the home page
      },
      limit: 1,
    });
    void pageClient
      .send(getPageCommand)
      .then((getPageOutput) => getPageOutput.payload())
      .then(([page = null]) => page)
      .then(setPage);
  }, [setPage, pathname]);

  return (
    <TwoColumnLayout>
      <Article>
        {page?.title}
        <Markdown>{page?.content}</Markdown>
      </Article>
    </TwoColumnLayout>
  );
}
