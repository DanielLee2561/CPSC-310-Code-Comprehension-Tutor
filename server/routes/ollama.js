
import express from 'express';
import { Ollama } from 'ollama';

const router = express.Router();
const ollama = new Ollama({ host: 'http://localhost:11434' });  


router.get('/submit', async (req, res) => {
    
    const { description, notes } = req.body;
    
    console.log("description: " + description + ", notes: " + notes);
    console.log("description"+description+notes);
    try {
        
        const output = await ollama.generate({
            model: 'codegemma',
            //need to change prompt content to specfic question
            prompt: description+" "+notes
        });

        const responseData = output.response;
        
        console.log(responseData);
        res.status(200).send(responseData);
    } catch (error) {
        res.status(500).send('Error processing your request: ' + error.message);
    }
});

export default router;