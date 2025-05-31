import dotenv from 'dotenv';
dotenv.config();
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

const activityLabels = [
  'Studying',
  'Coding',
  'Gaming',
  'Meeting',
  'Cooking',
  'Database Management',
  'Entertainment',
  'Productive AI',
  'Unknown'
];

export async function classifyProductivityText(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid or empty text provided');
    }

    const trimmedText = text.substring(0, 2000);
    console.log('Sending text to Hugging Face (length):', trimmedText.length);

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: trimmedText,
        });

        console.log('Text classification response:', response);
        const label = response[0].label === 'POSITIVE' ? 'productive' : 'unproductive';
        return { label, score: response[0].score };
      } catch (retryError) {
        attempts++;
        console.error(`Text attempt ${attempts}/${maxAttempts}:`, retryError.message);
        if (attempts === maxAttempts) throw retryError;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }
  } catch (error) {
    console.error('Text classification error:', error.message);
    throw new Error(`Text classification failed: ${error.message}`);
  }
}

export async function classifyProductivityImage(imageBase64) {
  try {
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Invalid or empty image provided');
    }
    if (!imageBase64.startsWith('data:image/jpeg;base64,')) {
      throw new Error('Image must be JPEG in base64 format');
    }

    const base64Data = imageBase64.replace(/^data:image\/jpeg;base64,/, '');
    let buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      throw new Error(`Invalid base64 encoding: ${error.message}`);
    }

    if (!buffer.slice(0, 2).equals(Buffer.from([0xff, 0xd8]))) {
      throw new Error('Not a valid JPEG image');
    }

    console.log('Image validated, using rule-based result');
    return { label: 'productive', score: 0.9 };
  } catch (error) {
    console.error('Image classification error:', error.message);
    throw new Error(`Image classification failed: ${error.message}`);
  }
}

export async function classifyActivityType(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid or empty text provided');
    }

    const trimmedText = text.substring(0, 512);
    console.log('Classifying activity type (length):', trimmedText.length);

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await hf.zeroShotClassification({
          model: 'facebook/bart-large-mnli',
          inputs: trimmedText,
          parameters: { candidate_labels: activityLabels },
        });

        console.log('Activity type response:', response);
        return {
          activityType: response.labels[0],
          score: response.scores[0],
        };
      } catch (retryError) {
        attempts++;
        console.error(`Activity type attempt ${attempts}/${maxAttempts}:`, retryError.message);
        if (attempts === maxAttempts) throw retryError;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }
  } catch (error) {
    console.error('Activity type classification error:', error.message);
    throw new Error(`Activity type classification failed: ${error.message}`);
  }
}

export async function classifyProductivity({ text, imageBase64, url = '' }) {
  try {
    let textResult = null, imageResult = null, activityResult = null;

    // Rule-based for specific domains
    if (
      url.includes('grok.x.ai') ||
      url.includes('grok.com') ||
      url.includes('meet.google.com') ||
      url.includes('chatgpt.com') ||
      url.includes('allrecipes.com')
    ) {
      const finalResult = { label: 'productive', score: 0.9 };
      const storedData = text?.substring(0, 2000) || imageBase64 || 'Fallback';
      const dataType = imageBase64 ? 'image' : 'text';
      let activityType = 'Unknown';
      if (url.includes('meet.google.com')) activityType = 'Meeting';
      else if (url.includes('grok.x.ai') || url.includes('grok.com') || url.includes('chatgpt.com')) activityType = 'Productive AI';
      else if (url.includes('allrecipes.com')) activityType = 'Cooking';

      if (text) {
        try {
          textResult = await classifyProductivityText(text);
          activityResult = await classifyActivityType(text);
          activityType = activityResult.activityType;
        } catch (error) {
          console.warn('Text or activity classification error:', error.message);
        }
      }
      if (imageBase64) {
        try {
          imageResult = await classifyProductivityImage(imageBase64);
        } catch (error) {
          console.warn('Image classification error:', error.message);
        }
      }

      return {
        label: finalResult.label,
        score: finalResult.score,
        storedData,
        dataType,
        activityType,
      };
    }

    // Non-rule-based URLs
    const results = await Promise.allSettled([
      text ? classifyProductivityText(text) : Promise.resolve(null),
      imageBase64 ? classifyProductivityImage(imageBase64) : Promise.resolve(null),
      text ? classifyActivityType(text) : Promise.resolve(null),
    ]);

    textResult = results[0].status === 'fulfilled' && results[0].value ? results[0].value : null;
    imageResult = results[1].status === 'fulfilled' && results[1].value ? results[1].value : null;
    activityResult = results[2].status === 'fulfilled' && results[2].value ? results[2].value : null;

    let finalResult, storedData, dataType, activityType;
    if (textResult && imageResult) {
      if (textResult.score < 0.7 && imageResult.score > 0.7) {
        finalResult = imageResult;
        storedData = imageBase64;
        dataType = 'image';
      } else {
        finalResult = textResult;
        storedData = text.substring(0, 2000);
        dataType = 'text';
      }
    } else if (textResult) {
      finalResult = textResult;
      storedData = text.substring(0, 2000);
      dataType = 'text';
    } else if (imageResult) {
      finalResult = imageResult;
      storedData = imageBase64;
      dataType = 'image';
    } else {
      throw new Error('No valid classification');
    }

    activityType = activityResult ? activityResult.activityType : 'Unknown';
    if (finalResult.label === 'productive' && activityType === 'Entertainment') {
      activityType = 'Studying';
      console.log('Overrode Entertainment to Studying');
    }

    console.log('Final classification:', {
      label: finalResult.label,
      score: finalResult.score,
      activityType,
    });

    return {
      label: finalResult.label,
      score: finalResult.score,
      storedData,
      dataType,
      activityType,
    };
  } catch (error) {
    console.error('Classification error:', error.message);
    throw new Error(`Classification failed: ${error.message}`);
  }
}