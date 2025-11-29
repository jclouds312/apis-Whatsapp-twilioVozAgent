'use client';

import { Header } from "@/components/dashboard/header";
import { TextToSpeechAgent } from "@/components/dashboard/text-to-speech-agent";

export default function TextToSpeechPage() {
  return (
    <>
      <Header title="AI Text-to-Speech" />
      <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="max-w-2xl mx-auto">
            <TextToSpeechAgent />
        </div>
      </main>
    </>
  );
}
