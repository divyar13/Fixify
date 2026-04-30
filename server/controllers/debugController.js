import { getGeminiModel, FALLBACK_MODEL } from '../config/gemini.js';
import { buildDebugPrompt } from '../utils/promptBuilder.js';
import ErrorLog from '../models/ErrorLog.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRetryDelay(err, attempt) {
  const retryInfo = err?.errorDetails?.find(
    d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
  );
  if (retryInfo?.retryDelay) {
    return parseInt(retryInfo.retryDelay) * 1000;
  }
  return Math.pow(2, attempt) * 1000;
}

async function callWithRetry(apiFn, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiFn();
    } catch (err) {
      if (err?.status === 503 && attempt < maxRetries - 1) {
        const delay = getRetryDelay(err, attempt);
        console.log(`Gemini 503. Retrying in ${delay / 1000}s... (attempt ${attempt + 1})`);
        await sleep(delay);
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

    let result;
    try {
      const model = getGeminiModel();
      result = await callWithRetry(() => model.generateContent(prompt));
    } catch (primaryErr) {
      if (primaryErr?.status === 503 || primaryErr?.status === 429) {
        console.log(`Primary model unavailable (${primaryErr.status}), trying fallback model...`);
        const fallback = getGeminiModel(FALLBACK_MODEL);
        result = await callWithRetry(() => fallback.generateContent(prompt));
      } else {
        throw primaryErr;
      }
    }
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
