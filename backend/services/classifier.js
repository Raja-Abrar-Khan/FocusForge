import { HfInference } from '@huggingface/inference';
const hf = new HfInference('YOUR_HF_TOKEN');

export async function classifyProductivity(text) {
  const response = await hf.zeroShotClassification({
    model: 'facebook/bart-large-mnli',
    inputs: text,
    parameters: {
      candidate_labels: ['productive', 'unproductive'], // Only 2 labels
    }
  });

  // Returns { label: 'productive', score: 0.92 }
  return {
    label: response.labels[0], // Highest scoring label
    score: response.scores[0]
  };
}