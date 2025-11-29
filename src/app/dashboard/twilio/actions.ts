'use server';

import twilio from 'twilio';
import { z } from 'zod';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
});

const codeSchema = z.string().length(6, {
    message: 'Verification code must be 6 digits long.',
});

// Helper function to initialize Twilio client
function getTwilioClient() {
    if (!accountSid || !authToken || !verifySid) {
        throw new Error('Twilio credentials are not configured on the server.');
    }
    return twilio(accountSid, authToken);
}

export async function sendVerificationToken(prevState: any, formData: FormData) {
    const validatedFields = phoneSchema.safeParse(formData.get('phone'));

    if (!validatedFields.success) {
        return {
            status: 'error' as const,
            message: validatedFields.error.flatten().formErrors[0],
            phone: formData.get('phone') as string,
        };
    }

    const phone = validatedFields.data;

    try {
        const client = getTwilioClient();
        await client.verify.v2
            .services(verifySid!)
            .verifications.create({ to: phone, channel: 'whatsapp' });
        
        return {
            status: 'success' as const,
            message: `Verification code sent to ${phone}.`,
            phone: phone,
        };

    } catch (error: any) {
        console.error("Twilio Verify Error:", error);
        return {
            status: 'error' as const,
            message: error.message || 'Failed to send verification code.',
            phone: phone,
        };
    }
}


export async function checkVerificationToken(prevState: any, formData: FormData) {
    const phone = formData.get('phone') as string;
    const code = formData.get('code') as string;

    const validatedPhone = phoneSchema.safeParse(phone);
    const validatedCode = codeSchema.safeParse(code);

    if (!validatedPhone.success) {
        return {
            status: 'error' as const,
            message: validatedPhone.error.flatten().formErrors[0],
        };
    }
    if (!validatedCode.success) {
        return {
            status: 'error' as const,
            message: validatedCode.error.flatten().formErrors[0],
        };
    }

    try {
        const client = getTwilioClient();
        const check = await client.verify.v2
            .services(verifySid!)
            .verificationChecks.create({ to: validatedPhone.data, code: validatedCode.data });

        if (check.status === 'approved') {
            return {
                status: 'success' as const,
                message: 'Verification successful!',
            };
        } else {
            return {
                status: 'error' as const,
                message: `Verification failed. Status: ${check.status}`,
            };
        }
    } catch (error: any) {
        console.error("Twilio Check Error:", error);
        return {
            status: 'error' as const,
            message: error.message || 'Failed to check verification code.',
        };
    }
}
