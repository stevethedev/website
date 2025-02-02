import AdminLayout from "@/component/layout/admin";
import Article from "@/component/ui/article";
import { type ReactElement } from "react";

export interface AdminDashboardPageProps {
  readonly apiUrl: string;
}

export default function AdminDashboardPage({
  apiUrl,
}: AdminDashboardPageProps): ReactElement {
  void apiUrl;
  return (
    <AdminLayout>
      <Article>Dashboard.</Article>
    </AdminLayout>
  );
}
