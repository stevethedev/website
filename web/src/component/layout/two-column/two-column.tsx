import PageHeader from "@/component/ui/page-header/page-header";

export default function TwoColumn() {
  return (
    <section>
      <PageHeader />
      <nav>page nav</nav>
      <section>
        <main>Page content</main>
        <aside>
          <div>Aside 1</div>
          <div>Aside 2</div>
        </aside>
      </section>
      <footer>Page footer</footer>
    </section>
  );
}
