
'use server';

import { generateSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';

const textToSpeechSchema = z.object({
  textToConvert: z.string().min(1, { message: 'Text to convert is required.' }),
});

export async function textToSpeech(prevState: any, formData: FormData) {
  const validatedFields = textToSpeechSchema.safeParse({
    textToConvert: formData.get('textToConvert'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      audioUrl: null,
    };
  }

  const { textToConvert } = validatedFields.data;

  try {
    const result = await generateSpeech(textToConvert);
    return { audioUrl: result.audio, errors: null };
  } catch (e) {
    console.error(e);
    return { audioUrl: null, errors: { _form: ['Failed to generate speech.'] } };
  }
}
