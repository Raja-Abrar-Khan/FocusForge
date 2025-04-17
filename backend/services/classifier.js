import dotenv from 'dotenv';
dotenv.config();

import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

export async function classifyProductivity(text) {
  const response = await hf.request({
    model: 'facebook/bart-large-mnli',
    inputs: text,
    parameters: {
      candidate_labels: ['productive', 'unproductive'],
    },
  });

  // Parse and return higheest scorinig label
  return {
    label: response.labels[0],
    score: response.scores[0]
  };
}
