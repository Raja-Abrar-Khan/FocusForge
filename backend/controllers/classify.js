import { classifyProductivityText, classifyProductivityImage, classifyProductivity } from '../services/classifier.js';
import Productivity from '../models/Productivity.js';
import Screenshot from '../models/Screenshot.js';

export const classifyText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await classifyProductivityText(text);
    console.log(`📝 Text classified: ${result.label} (Score: ${result.score})`);
    res.json(result);
  } catch (error) {
    console.error('Text classification error:', error.message);
    res.status(500).json({ error: 'Text classification failed', details: error.message });
  }
};

export const classifyImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Image is required' });

    const result = await classifyProductivityImage(imageBase64);
    console.log(`🖼️ Image classified: ${result.label} (Score: ${result.score})`);
    res.json(result);
  } catch (error) {
    console.error('Image classification error:', error.message);
    res.status(500).json({ error: 'Image classification failed', details: error.message });
  }
};

export const classifyCombined = async (req, res) => {
  try {
    const { text, imageBase64, url } = req.body;
    if (!text && !imageBase64 && !url) return res.status(400).json({ error: 'At least one of text, image, or URL is required' });
    if (text && typeof text !== 'string') return res.status(400).json({ error: 'Text must be a string' });
    if (imageBase64 && typeof imageBase64 !== 'string') return res.status(400).json({ error: 'Image must be a base64 string' });
    if (url && typeof url !== 'string') return res.status(400).json({ error: 'URL must be a string' });

    console.log('Received classification request:', {
      hasText: !!text,
      hasImage: !!imageBase64,
      url: url || 'none',
      textLength: text?.length,
      imageLength: imageBase64?.length,
    });

    const result = await classifyProductivity({ text, imageBase64, url });

    // Reassign Unknown to Studying
    const finalActivityType = result.activityType === 'Unknown' ? 'Studying' : result.activityType;
    if (result.activityType === 'Unknown') {
      console.log(`🔄 Reassigned Unknown to Studying for ${url || 'no url'}`);
    }

    // Store screenshot
    let screenshotId = null;
    if (imageBase64) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const screenshot = new Screenshot({
        user: req.user.id,
        date: today,
        imageBase64,
        url: url || 'Unknown',
      });
      await screenshot.save();
      screenshotId = screenshot._id;
      console.log(`🖼️ Screenshot saved: ID ${screenshotId}`);
    }

    // Store in Productivity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 3 * 60 * 1000); // 3 minutes

    const update = {
      $inc: {
        [result.label === 'productive' ? 'productiveTime' : 'unproductiveTime']: 180,
        [`activityTime.${finalActivityType}`]: 180,
      },
      $push: {
        history: {
          $each: [{
            startTime,
            endTime,
            url: url || '',
            data: result.storedData?.substring(0, 2000) || '',
            dataType: result.dataType || 'text',
            isProductive: result.label === 'productive',
            confidence: result.score,
            activityType: finalActivityType,
            screenshot: screenshotId,
          }],
          $slice: -100,
        },
      },
    };

    await Productivity.findOneAndUpdate(
      { user: req.user.id, date: today },
      update,
      { new: true, upsert: true }
    );

    console.log(`✅ Classified: ${url || 'no url'} -> ${finalActivityType} (${result.label}, Score: ${result.score})`);

    res.json({
      label: result.label,
      score: result.score,
      activityType: finalActivityType,
    });
  } catch (error) {
    console.error('Combined classification error:', error.message);
    res.status(500).json({ error: 'Combined classification failed', details: error.message });
  }
};