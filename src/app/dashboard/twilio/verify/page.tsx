'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyForm } from "@/components/dashboard/twilio/verify-form";


export default function TwilioVerifyPage() {
    return (
        <>
            <Header title="Twilio Verify" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phone Verification</CardTitle>
                        <CardDescription>Verify phone numbers using Twilio Verify service</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VerifyForm />
                    </CardContent>
                </Card>
            </main>
        </>
    )
}