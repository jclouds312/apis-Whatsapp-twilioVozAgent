import { Header } from "@/components/dashboard/header";
import { RetellAgent } from "@/components/dashboard/retell-agent";

export default function RetellAgentPage() {
  return (
    <>
      <Header title="AI Retell Agent" />
      <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="max-w-2xl mx-auto">
            <RetellAgent />
        </div>
      </main>
    </>
  );
}
