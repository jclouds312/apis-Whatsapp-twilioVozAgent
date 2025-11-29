'use server';
/**
 * @fileOverview An AI agent that retells a given text.
 *
 * - retellAgent - A function that handles the text retell process.
 * - RetellAgentInput - The input type for the retellAgent function.
 * - RetellAgentOutput - The return type for the retellAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetellAgentInputSchema = z.object({
  textToRetell: z.string().describe('The text that needs to be retold.'),
});
export type RetellAgentInput = z.infer<typeof RetellAgentInputSchema>;

const RetellAgentOutputSchema = z.object({
  retoldText: z
    .string()
    .describe('The retold version of the text, which could be a summary, a rephrasing, or a transformation.'),
});
export type RetellAgentOutput = z.infer<typeof RetellAgentOutputSchema>;

export async function retellAgent(input: RetellAgentInput): Promise<RetellAgentOutput> {
  return retellAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retellAgentPrompt',
  input: {schema: RetellAgentInputSchema},
  output: {schema: RetellAgentOutputSchema},
  prompt: `You are an expert "retell" agent. Your job is to rephrase, summarize, or transform the given text into a more concise, clear, or otherwise improved version.

Analyze the following text and provide a "retold" version of it.

Original Text: {{{textToRetell}}}

Provide the retold text in the 'retoldText' field.`,
});

const retellAgentFlow = ai.defineFlow(
  {
    name: 'retellAgentFlow',
    inputSchema: RetellAgentInputSchema,
    outputSchema: RetellAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
