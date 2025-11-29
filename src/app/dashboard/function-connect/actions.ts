'use server';

import { suggestOptimalWorkflows } from '@/ai/flows/suggest-optimal-workflows';
import { z } from 'zod';

const schema = z.object({
    crmDataStructures: z.string().min(10, { message: 'CRM data structure must be at least 10 characters long.' }),
    communicationPatterns: z.string().min(10, { message: 'Communication patterns must be at least 10 characters long.' }),
});

export async function getWorkflowSuggestion(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    crmDataStructures: formData.get('crmDataStructures'),
    communicationPatterns: formData.get('communicationPatterns'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      suggestion: null,
    };
  }

  const { crmDataStructures, communicationPatterns } = validatedFields.data;

  try {
    const result = await suggestOptimalWorkflows({
      crmDataStructures,
      communicationPatterns,
    });
    return { suggestion: result.suggestedWorkflows, errors: null };
  } catch (e) {
    console.error(e);
    return { suggestion: null, errors: { _form: ['Failed to generate suggestion.'] } };
  }
}
