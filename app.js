require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.prompt;

    // If it's the start of the conversation, send a welcoming message
    if (userMessage.toLowerCase() === "start") {
      return res.json({ response: "Hi, I am CalmQuest, your personal therapist. How can I help you today?" });
    }

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage },
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const botResponse = chatCompletion.data.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating a response.');
  }
});

app.listen(3000, () => {
  console.log('CalmQuest is running on http://localhost:3000');
});
