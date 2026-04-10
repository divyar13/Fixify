import { getGeminiModel } from '../config/gemini.js';
import { buildDebugPrompt } from '../utils/promptBuilder.js';
import ErrorLog from '../models/ErrorLog.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function extractRetryDelay(err) {
  const violations = err?.errorDetails?.find(
    d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
  );
  if (violations?.retryDelay) {
    return parseInt(violations.retryDelay) * 1000;
  }
  return null;
}

async function callWithRetry(apiFn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiFn();
    } catch (err) {
      const retryDelay = extractRetryDelay(err);
      if (retryDelay && attempt < maxRetries - 1) {
        console.log(`Rate limited. Retrying in ${retryDelay / 1000}s...`);
        await sleep(retryDelay);
      } else {
        throw err;
      }
    }
  }
}

export const analyzeError = async (req, res) => {
  try {
    const { errorText, language } = req.body;

    if (!errorText || errorText.trim().length === 0) {
      return res.status(400).json({ message: 'Error text is required' });
    }

    const prompt = buildDebugPrompt(errorText, language);
    const model = getGeminiModel();

    const result = await callWithRetry(() => model.generateContent(prompt));
    const responseText = result.response.text();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Gemini response as JSON');
      }
    }

    let savedError = null;
    if (req.userId) {
      savedError = await ErrorLog.create({
        userId: req.userId,
        errorText,
        language: language || 'Unknown',
        explanation: parsedResponse.explanation,
        rootCause: parsedResponse.rootCause,
        fix: parsedResponse.fix,
        prevention: parsedResponse.prevention,
        docsLink: parsedResponse.docsLink,
      });
    }

    res.json({
      analysis: parsedResponse,
      saved: !!savedError,
      errorLogId: savedError?._id,
    });
  } catch (error) {
    console.error('Error analyzing:', error);
    res.status(500).json({
      message: 'Error analyzing error message',
      error: error.message,
    });
  }
};

export const getSimilarErrors = async (req, res) => {
  try {
    const { language } = req.query;

    let query = { isShared: true };
    if (language) {
      query.language = language;
    }

    const errors = await ErrorLog.find(query)
      .select('errorText language explanation tags upvotes createdAt')
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(5);

    res.json(errors);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching similar errors',
      error: error.message,
    });
  }
};
