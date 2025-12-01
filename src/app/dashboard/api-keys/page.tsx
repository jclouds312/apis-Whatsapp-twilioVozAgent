
import { Header } from "@/components/dashboard/header";
import { ApiKeysTable } from "@/components/dashboard/api-keys/api-keys-table";

export default function ApiKeysPage() {
  return (
    <>
      <Header title="API Keys" />
      <main className="p-4 lg:p-6">
        <ApiKeysTable />
      </main>
    </>
  );
}
