export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  llm: {
    apiKey: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
  },
});
