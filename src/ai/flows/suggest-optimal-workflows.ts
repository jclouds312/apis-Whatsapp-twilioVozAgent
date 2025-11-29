'use server';

/**
 * @fileOverview A flow that suggests optimal workflow configurations within Function Connect based on CRM data structures and communication patterns.
 *
 * - suggestOptimalWorkflows - A function that suggests optimal workflow configurations.
 * - SuggestOptimalWorkflowsInput - The input type for the suggestOptimalWorkflows function.
 * - SuggestOptimalWorkflowsOutput - The return type for the suggestOptimalWorkflows function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalWorkflowsInputSchema = z.object({
  crmDataStructures: z
    .string()
    .describe('The data structures of the CRM, including entities and fields.'),
  communicationPatterns: z
    .string()
    .describe(
      'The communication patterns between different systems, including message formats and protocols.'
    ),
});
export type SuggestOptimalWorkflowsInput = z.infer<typeof SuggestOptimalWorkflowsInputSchema>;

const SuggestOptimalWorkflowsOutputSchema = z.object({
  suggestedWorkflows: z
    .string()
    .describe(
      'The suggested workflow configurations, including data mappings and conditional rules.'
    ),
});
export type SuggestOptimalWorkflowsOutput = z.infer<typeof SuggestOptimalWorkflowsOutputSchema>;

export async function suggestOptimalWorkflows(
  input: SuggestOptimalWorkflowsInput
): Promise<SuggestOptimalWorkflowsOutput> {
  return suggestOptimalWorkflowsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalWorkflowsPrompt',
  input: {schema: SuggestOptimalWorkflowsInputSchema},
  output: {schema: SuggestOptimalWorkflowsOutputSchema},
  prompt: `You are an expert in designing workflow configurations for connecting different systems.

  Based on the CRM data structures and communication patterns, suggest optimal workflow configurations within Function Connect.

  CRM Data Structures: {{{crmDataStructures}}}
  Communication Patterns: {{{communicationPatterns}}}

  Provide the suggested workflow configurations, including data mappings and conditional rules.
  `,
});

const suggestOptimalWorkflowsFlow = ai.defineFlow(
  {
    name: 'suggestOptimalWorkflowsFlow',
    inputSchema: SuggestOptimalWorkflowsInputSchema,
    outputSchema: SuggestOptimalWorkflowsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
