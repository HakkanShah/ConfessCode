// This is a server-side file!
'use server';

/**
 * @fileOverview A content moderation AI agent.
 *
 * - moderateConfession - A function that handles the content moderation process.
 * - ModerateConfessionInput - The input type for the moderateConfession function.
 * - ModerateConfessionOutput - The return type for the moderateConfession function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateConfessionInputSchema = z.object({
  text: z.string().describe('The confession text to be moderated.'),
});
export type ModerateConfessionInput = z.infer<typeof ModerateConfessionInputSchema>;

const ModerateConfessionOutputSchema = z.object({
  isToxic: z.boolean().describe('Whether the confession is considered toxic.'),
  toxicityScore: z
    .number()
    .describe('The toxicity score of the confession, from 0 to 1.'),
});
export type ModerateConfessionOutput = z.infer<typeof ModerateConfessionOutputSchema>;

export async function moderateConfession(input: ModerateConfessionInput): Promise<ModerateConfessionOutput> {
  return moderateConfessionFlow(input);
}

const toxicityCheckPrompt = ai.definePrompt({
  name: 'toxicityCheckPrompt',
  model: 'googleai/gemini-pro',
  input: {schema: ModerateConfessionInputSchema},
  output: {schema: ModerateConfessionOutputSchema},
  prompt: `You are a content moderation tool that detects toxic content.
  Your job is to rate the toxicity of the following text and provide a toxicity score between 0 and 1.
  You will also set the isToxic field to true if the toxicity score is above 0.7, otherwise false.
  Text: {{{text}}}`,
});

const moderateConfessionFlow = ai.defineFlow(
  {
    name: 'moderateConfessionFlow',
    inputSchema: ModerateConfessionInputSchema,
    outputSchema: ModerateConfessionOutputSchema,
  },
  async input => {
    const {output} = await toxicityCheckPrompt(input);
    return output!;
  }
);
