import ClientWrapper from "../components/ClientWrapper";
import TableGrid from "../components/TableGrid";

export default function Home() {
  return (
    <ClientWrapper>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="home-container space-y-6">
            <section className="table-grid-section">
              <TableGrid />
            </section>
          </div>
        </main>
      </div>
    </ClientWrapper>
  );
}
