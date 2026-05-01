'use server';
/**
 * @fileOverview An AI agent that generates personalized interior design ideas and tips.
 *
 * - generateDesignIdeas - A function that generates design ideas based on user input.
 * - DesignIdeaGeneratorInput - The input type for the generateDesignIdeas function.
 * - DesignIdeaGeneratorOutput - The return type for the generateDesignIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DesignIdeaGeneratorInputSchema = z.object({
  spaceType: z.string().describe('The type of space to design (e.g., "modular kitchen", "wardrobe", "wall paneling").'),
  roomSize: z.string().describe('The size of the room or area (e.g., "small", "medium", "large", "10x12 feet").'),
  stylePreference: z.string().describe('User\'s preferred design style (e.g., "modern", "minimalist", "traditional", "industrial", "bohemian").'),
  colorPalette: z.array(z.string()).describe('A list of preferred colors or color families (e.g., ["white", "grey", "wood grain", "navy blue"]).'),
  specificRequirements: z.string().optional().describe('Any specific requirements or features the user wants (e.g., "maximize storage", "include an island", "open shelving").'),
});
export type DesignIdeaGeneratorInput = z.infer<typeof DesignIdeaGeneratorInputSchema>;

const DesignIdeaGeneratorOutputSchema = z.object({
  designConceptTitle: z.string().describe('A catchy title for the design concept.'),
  designOverview: z.string().describe('A brief overview of the generated design concept.'),
  designIdeas: z.array(z.string()).describe('A list of detailed design ideas for the space.'),
  designTips: z.array(z.string()).describe('A list of practical tips for implementing the design.'),
  visualDescription: z.string().describe('A detailed textual description suitable for generating an image of the designed space.'),
});
export type DesignIdeaGeneratorOutput = z.infer<typeof DesignIdeaGeneratorOutputSchema>;

export async function generateDesignIdeas(input: DesignIdeaGeneratorInput): Promise<DesignIdeaGeneratorOutput> {
  return aiDesignIdeaGeneratorFlow(input);
}

const aiDesignIdeaGeneratorPrompt = ai.definePrompt({
  name: 'aiDesignIdeaGeneratorPrompt',
  input: {schema: DesignIdeaGeneratorInputSchema},
  output: {schema: DesignIdeaGeneratorOutputSchema},
  prompt: `You are an expert interior designer specializing in modern modular solutions. Your goal is to provide personalized design ideas and practical tips based on the user's input.

Generate a creative and detailed design concept for the user's space, including a concept title, an overview, specific design ideas, and actionable tips. Also, provide a visual description that could be used to generate an image of this design.

User Input:
Space Type: {{{spaceType}}}
Room Size: {{{roomSize}}}
Style Preference: {{{stylePreference}}}
Color Palette: {{{colorPalette}}}
{{#if specificRequirements}}
Specific Requirements: {{{specificRequirements}}}
{{/if}}

Consider the following in your response:
- Focus on modular kitchens, wardrobe systems, or wall paneling as appropriate for the space type.
- Incorporate the specified style preference and color palette.
- Provide practical advice suitable for the given room size.
- Address any specific requirements the user has.
- Ensure the visual description is vivid and descriptive, ready for image generation.`,
});

const aiDesignIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'aiDesignIdeaGeneratorFlow',
    inputSchema: DesignIdeaGeneratorInputSchema,
    outputSchema: DesignIdeaGeneratorOutputSchema,
  },
  async input => {
    const {output} = await aiDesignIdeaGeneratorPrompt(input);
    return output!;
  }
);
