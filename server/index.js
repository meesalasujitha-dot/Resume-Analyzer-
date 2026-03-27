require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractTextFromFile } = require('./utils/textExtractor');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Set up OpenAI (allow dummy key to not crash on init)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// Set up Multer (store file in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF or DOCX file.' });
    }

    // Extract text
    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    
    // Call OpenAI
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key_here')) {
      console.log('Mocking OpenAI response because no valid API key is set.');
      // Return mock data for testing
      return res.json({
        score: 85,
        skills: ["JavaScript", "React", "Node.js", "Express", "Tailwind CSS"],
        missing_keywords: ["Docker", "GraphQL", "AWS"],
        suggestions: [
          "Add more quantifiable metrics to your recent role.",
          "Include a link to your GitHub profile.",
          "Extracted text length from your resume: " + text.length + " characters."
        ]
      });
    }

    const prompt = `You are an expert HR recruiter and career coach. Review the following resume text and provide a detailed analysis in strictly JSON format.
The JSON must have the following structure:
{
  "score": <number between 0 and 100 representing overall quality>,
  "skills": [<array of string skills found>],
  "missing_keywords": [<array of important industry keywords missing>],
  "suggestions": [<array of actionable improvement suggestions>]
}

Resume Text:
"""
${text}
"""
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const resultString = response.choices[0].message.content;
    const resultJson = JSON.parse(resultString);

    return res.json(resultJson);
  } catch (error) {
    console.error('Error processing resume:', error);
    // Be sure to return proper JSON error
    return res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
