
'use server';

import twilio from 'twilio';
import { z } from 'zod';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
});

function getTwilioClient() {
    if (!accountSid || !authToken) {
        throw new Error('Twilio credentials are not configured on the server.');
    }
    return twilio(accountSid, authToken);
}

export async function makeCall(to: string, from: string) {
    const validatedTo = phoneSchema.safeParse(to);
    const validatedFrom = phoneSchema.safeParse(from);

    if (!validatedTo.success) {
        return { success: false, error: validatedTo.error.flatten().formErrors[0] };
    }
    if (!validatedFrom.success) {
        return { success: false, error: validatedFrom.error.flatten().formErrors[0] };
    }

    try {
        const client = getTwilioClient();
        const call = await client.calls.create({
            to: validatedTo.data,
            from: validatedFrom.data,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/voice`,
        });

        return {
            success: true,
            callSid: call.sid,
            status: call.status,
        };
    } catch (error: any) {
        console.error("Twilio Call Error:", error);
        return {
            success: false,
            error: error.message || 'Failed to initiate call',
        };
    }
}

export async function endCall(callSid: string) {
    try {
        const client = getTwilioClient();
        await client.calls(callSid).update({ status: 'completed' });
        return { success: true };
    } catch (error: any) {
        console.error("Twilio End Call Error:", error);
        return { success: false, error: error.message };
    }
}

export async function muteCall(callSid: string) {
    try {
        const client = getTwilioClient();
        await client.calls(callSid).update({ muted: true });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function unmuteCall(callSid: string) {
    try {
        const client = getTwilioClient();
        await client.calls(callSid).update({ muted: false });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCallRecordings(callSid: string) {
    try {
        const client = getTwilioClient();
        const recordings = await client.recordings.list({ callSid, limit: 20 });
        return { success: true, recordings };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
