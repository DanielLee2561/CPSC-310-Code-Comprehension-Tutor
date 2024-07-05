
import express from 'express';
import { Ollama } from 'ollama';

const router = express.Router();
const ollama = new Ollama({ host: 'http://localhost:11434' });  
router.get('/submit', async (req, res) => {
    try {
        const output = await ollama.generate({
            model: 'codegemma',
            //need to change prompt content to specfic question
            prompt: "Give me a list of cities in the state of Wisconsin with a population of over 100,000 people in the form of a JSON array. It should look something like '[\"City 1\", \"City 2\", \"City 3\"]' in the output. Don't include any other text beyond the JSON."
        });

        const responseData = output.response.trim();
        const jsonStringStart = responseData.indexOf('[');
        const jsonStringEnd = responseData.lastIndexOf(']') + 1;
        const jsonString = responseData.substring(jsonStringStart, jsonStringEnd);

        const cityArray = JSON.parse(jsonString);

        let htmlList = '<ul>';
        for (let city of cityArray) {
            htmlList += `<li>${city}</li>`;
        }
        htmlList += '</ul>';

        res.send(htmlList);
    } catch (error) {
        res.status(500).send('Error processing your request: ' + error.message);
    }
});

export default router;