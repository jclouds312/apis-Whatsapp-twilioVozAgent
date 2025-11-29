import { Header } from "@/components/dashboard/header";
import { WorkflowSuggester } from "@/components/dashboard/workflow-suggester";

export default function WorkflowSuggesterPage() {
  return (
    <>
      <Header title="Intelligent Workflow Suggestion" />
      <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="max-w-2xl mx-auto">
            <WorkflowSuggester />
        </div>
      </main>
    </>
  );
}
