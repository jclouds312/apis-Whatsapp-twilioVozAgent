
'use server';

import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const db = getFirestore();

async function logVerificationAttempt(
    phoneNumber: string,
    success: boolean,
    type: 'send' | 'verify'
) {
    try {
        await addDoc(collection(db, 'apiLogs'), {
            timestamp: new Date().toISOString(),
            level: success ? 'info' : 'error',
            endpoint: 'Twilio Verify',
            statusCode: success ? 200 : 400,
            requestBody: JSON.stringify({ phoneNumber, type }),
            responseBody: JSON.stringify({ success }),
            apiKeyId: 'twilio_verify',
        });
    } catch (error) {
        console.error('Failed to log verification attempt:', error);
    }
}

export async function sendVerificationCode(phoneNumber: string) {
    try {
        // Validar formato de número
        if (!phoneNumber.startsWith('+')) {
            return {
                success: false,
                message: 'Phone number must include country code (e.g., +1234567890)'
            };
        }

        // Aquí se integraría con Twilio Verify API
        // const accountSid = process.env.TWILIO_ACCOUNT_SID;
        // const authToken = process.env.TWILIO_AUTH_TOKEN;
        // const verifySid = process.env.TWILIO_VERIFY_SID;
        
        // Simulación de envío exitoso
        await logVerificationAttempt(phoneNumber, true, 'send');
        
        return {
            success: true,
            message: `Verification code sent to ${phoneNumber}`
        };
    } catch (error) {
        console.error('Error sending verification:', error);
        await logVerificationAttempt(phoneNumber, false, 'send');
        
        return {
            success: false,
            message: 'Failed to send verification code'
        };
    }
}

export async function verifyCode(phoneNumber: string, code: string) {
    try {
        // Validar código
        if (code.length !== 6 || !/^\d+$/.test(code)) {
            return {
                success: false,
                message: 'Code must be 6 digits'
            };
        }

        // Aquí se verificaría el código con Twilio Verify API
        // const accountSid = process.env.TWILIO_ACCOUNT_SID;
        // const authToken = process.env.TWILIO_AUTH_TOKEN;
        // const verifySid = process.env.TWILIO_VERIFY_SID;
        
        // Simulación de verificación exitosa
        await logVerificationAttempt(phoneNumber, true, 'verify');
        
        return {
            success: true,
            message: 'Phone number verified successfully'
        };
    } catch (error) {
        console.error('Error verifying code:', error);
        await logVerificationAttempt(phoneNumber, false, 'verify');
        
        return {
            success: false,
            message: 'Invalid verification code'
        };
    }
}
