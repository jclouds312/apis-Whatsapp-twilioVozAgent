'use server';

/**
 * @fileOverview A flow for converting text to speech using Genkit and Google AI.
 *
 * - generateSpeech - A function that takes text and returns a WAV audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.object({ audio: z.string() }),
  },
  async (text) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media?.url) {
      throw new Error('No audio media was returned from the AI model.');
    }

    // Extract base64 PCM data from data URI
    const pcmDataBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    // Convert PCM to WAV
    const wavBase64 = await toWav(pcmDataBuffer);

    return {
      audio: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);


export async function generateSpeech(text: string) {
    return ttsFlow(text);
}
