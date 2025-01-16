require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to handle chat requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([userMessage]);
        const responseText = result.response.text();
        
        res.json({ response: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating response');
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
