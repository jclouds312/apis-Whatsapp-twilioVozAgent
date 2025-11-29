import { Header } from "@/components/dashboard/header";
import { VerifyForm } from "@/components/dashboard/twilio/verify-form";


export default function TwilioVerifyPage() {
  return (
    <>
      <Header title="Twilio Verify for WhatsApp" />
      <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="max-w-2xl mx-auto">
            <VerifyForm />
        </div>
      </main>
    </>
  );
}
