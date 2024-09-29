import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { term } = req.body;

  // Check if term is provided
  if (!term) {
    return res.status(400).json({ error: 'Missing search term in request body.' });
  }

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Find relevant events for the search term: "${term}".`,
      max_tokens: 150,
    });

    // Send back the AI's response
    res.status(200).json({ result: response.choices[0].text });
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    res.status(500).json({ error: 'Error in AI search.' });
  }
}
