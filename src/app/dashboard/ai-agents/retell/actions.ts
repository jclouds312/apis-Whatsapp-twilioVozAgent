
'use server';

import { retellAgent } from '@/ai/flows/retell-agent';
import { z } from 'zod';

const retellSchema = z.object({
  textToRetell: z.string().min(10, { message: 'Text to retell must be at least 10 characters long.' }),
});

export async function retellText(prevState: any, formData: FormData) {
  const validatedFields = retellSchema.safeParse({
    textToRetell: formData.get('textToRetell'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      retoldText: null,
    };
  }

  const { textToRetell } = validatedFields.data;

  try {
    const result = await retellAgent({ textToRetell });
    return { retoldText: result.retoldText, errors: null };
  } catch (e) {
    console.error(e);
    return { retoldText: null, errors: { _form: ['Failed to retell text.'] } };
  }
}
