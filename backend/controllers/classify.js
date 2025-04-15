import { classifyProductivity } from '../services/classifier.js';

export const classifyText = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await classifyProductivity(text);
    res.json(result);

  } catch (error) {
    res.status(500).json({ 
      error: "AI classification failed",
      details: error.message 
    });
  }
};