'use server';

import { suggestOptimalWorkflows } from '@/ai/flows/suggest-optimal-workflows';
import { retellAgent } from '@/ai/flows/retell-agent';
import { z } from 'zod';

const suggestionSchema = z.object({
    crmDataStructures: z.string().min(10, { message: 'CRM data structure must be at least 10 characters long.' }),
    communicationPatterns: z.string().min(10, { message: 'Communication patterns must be at least 10 characters long.' }),
});

export async function getWorkflowSuggestion(prevState: any, formData: FormData) {
  const validatedFields = suggestionSchema.safeParse({
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

const retellSchema = z.object({
    textToRetell: z.string().min(5, { message: 'Text must be at least 5 characters long.' }),
});

export async function getRetellSuggestion(prevState: any, formData: FormData) {
  const validatedFields = retellSchema.safeParse({
    textToRetell: formData.get('textToRetell'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      suggestion: null,
    };
  }

  const { textToRetell } = validatedFields.data;

  try {
    const result = await retellAgent({ textToRetell });
    return { suggestion: result.retoldText, errors: null };
  } catch (e) {
    console.error(e);
    return { suggestion: null, errors: { _form: ['Failed to generate suggestion.'] } };
  }
}
