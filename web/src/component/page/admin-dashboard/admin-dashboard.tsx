import AdminLayout from "@/component/layout/admin";
import styles from "@/component/layout/admin/admin.module.css";
import Article from "@/component/ui/article";
import PageHeader from "@/component/ui/page-header";
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
      <Article>
        <PageHeader className={styles["header"]} links={[]} />
      </Article>
    </AdminLayout>
  );
}
