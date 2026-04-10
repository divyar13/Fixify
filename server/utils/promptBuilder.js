export const buildDebugPrompt = (errorText, language) => {
  return `You are an expert debugger and senior software engineer. Analyze this error and provide:
1. Plain English explanation — what went wrong (no jargon)
2. Root cause — why this happens
3. Exact fix — working code snippet that solves it
4. Prevention tip — how to avoid this in future
5. Docs link — most relevant official documentation URL

Error/Stack trace: ${errorText}
Language/Framework: ${language || 'Unknown'}

Respond ONLY in valid JSON format with these exact keys: explanation (string), rootCause (string), fix (object with keys: description and code), prevention (string), docsLink (string)

Important: Ensure the JSON is valid and can be parsed. Do not include markdown formatting like \`\`\`json around the response.`;
};
