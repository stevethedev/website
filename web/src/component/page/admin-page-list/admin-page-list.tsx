import AdminLayout from "@/component/layout/admin";
import Article from "@/component/ui/article";
import { type ReactElement } from "react";

export interface AdminPageListPageProps {
  readonly apiUrl: string;
}

export default function AdminPageListPage({
  apiUrl,
}: AdminPageListPageProps): ReactElement {
  void apiUrl;
  return (
    <AdminLayout>
      <Article>Admin page data goes here.</Article>
    </AdminLayout>
  );
}
