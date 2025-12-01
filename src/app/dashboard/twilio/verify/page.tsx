
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyForm } from "@/components/dashboard/twilio/verify-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle, Shield } from "lucide-react";
import { useState } from "react";

interface VerificationLog {
    id: string;
    phoneNumber: string;
    status: 'verified' | 'failed' | 'pending';
    timestamp: Date;
}

export default function TwilioVerifyPage() {
    const [verifications, setVerifications] = useState<VerificationLog[]>([]);

    const handleVerificationSuccess = (phoneNumber: string) => {
        setVerifications(prev => [{
            id: Date.now().toString(),
            phoneNumber,
            status: 'verified',
            timestamp: new Date()
        }, ...prev]);
    };

    const getStatusBadge = (status: VerificationLog['status']) => {
        switch (status) {
            case 'verified':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Verified</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    return (
        <>
            <Header title="Twilio Verify" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-6 w-6 text-blue-500" />
                                <CardTitle>Phone Verification</CardTitle>
                            </div>
                            <CardDescription>
                                Verify phone numbers using Twilio Verify API
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VerifyForm onVerificationSuccess={handleVerificationSuccess} />
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Verification Statistics</CardTitle>
                            <CardDescription>Overview of verification activity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Verified Today</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {verifications.filter(v => v.status === 'verified').length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Failed Today</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {verifications.filter(v => v.status === 'failed').length}
                                    </p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="transition-all hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Recent Verifications</CardTitle>
                        <CardDescription>History of phone verification attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {verifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No verifications yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    verifications.map(verification => (
                                        <TableRow key={verification.id}>
                                            <TableCell className="font-mono">{verification.phoneNumber}</TableCell>
                                            <TableCell>{getStatusBadge(verification.status)}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(verification.timestamp, 'PPpp')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
