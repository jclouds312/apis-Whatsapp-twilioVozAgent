'use server';

export async function sendVerificationCode(phoneNumber: string) {
    try {
        // Aquí se integraría con Twilio Verify API
        // Por ahora retornamos una respuesta simulada
        return {
            success: true,
            message: `Verification code sent to ${phoneNumber}`
        };
    } catch (error) {
        console.error('Error sending verification:', error);
        return {
            success: false,
            message: 'Failed to send verification code'
        };
    }
}

export async function verifyCode(phoneNumber: string, code: string) {
    try {
        // Aquí se verificaría el código con Twilio Verify API
        return {
            success: true,
            message: 'Phone number verified successfully'
        };
    } catch (error) {
        console.error('Error verifying code:', error);
        return {
            success: false,
            message: 'Invalid verification code'
        };
    }
}