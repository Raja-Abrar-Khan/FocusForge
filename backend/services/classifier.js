import dotenv from 'dotenv';
dotenv.config();

import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

export async function classifyProductivity(text) {
  try {
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid or empty text provided');
    }

    // Limit text to 512 tokens
    const trimmedText = text.substring(0, 1000);
    console.log('Sending text to Hugging Face API (length):', trimmedText.length);

    // Use textClassification with DistilBERT
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: trimmedText,
        });

        console.log('Hugging Face API response:', response);

        // Map DistilBERT's POSITIVE/NEGATIVE to productive/unproductive
        const label = response[0].label === 'POSITIVE' ? 'productive' : 'unproductive';
        const score = response[0].score;
        return {
          label: label,
          score: score,
        };
      } catch (retryError) {
        attempts++;
        console.error(`Attempt ${attempts}/${maxAttempts} failed:`, retryError.message);
        if (attempts === maxAttempts) throw retryError;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }
  } catch (error) {
    console.error('Hugging Face classification error:', error.message);
    throw new Error(`Classification failed: ${error.message}`);
  }
}