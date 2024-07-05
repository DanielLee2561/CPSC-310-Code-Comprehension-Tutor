import express, { response } from "express";
const router = express.Router();
//const app = express();
import fs from 'fs';
import path from 'path';
import session from 'express-session';

//const userJSONPath = path.join(process.cwd(), 'data', 'users.json');

let users;

// read user's specific question's attempts
fs.readFile('../data/users.json', 'utf8', (err, data) => {
    if (err) return console.error('Error reading user.json: ', err);
    console.log("Before fs try");
    try {
        //let content = JSON.parse(data); 
        users = JSON.parse(data).users;
        console.log(users);
    } catch (err) {
        console.error('Error parsing user.json: ', err);
    }
});

// if the data from the url, can use fetch to get the data from the frontend
//fetch('../data/users.json')
//    .then((response)=>response.json())
//    .then((json)=>console.log(json));
//console.log(users);

// View Previous Attempt for a Specific Question
router.get('/:username/test', (req, res) => {
    //const [username] = req.params;
    const {username, questionId, attemptId} = req.body;
    if (!username || !questionId || !attemptId)
        return res.status(400).json({error:"username, questionId and attemptId are required."});

    const user = users.find(c => c.username === username);
    if (!user) return res.status(404).send('User is not found.');

    const question = user.questions.find(c => c.questionId === questionId);
    if (!question) return res.status(404).send('Question is not found.');

    //const attempt = question.attempts[attemptId-1];
    const attempts = question.attempts;

    let foundAttempt;
    let index = 1;

    for (let attempt of attempts) {
        if (index === attemptId) {
            foundAttempt = attempt;
            break;
        }
        index++;
    }

    if (!foundAttempt) return res.status(404).send('Attempt is not found.');

    console.log(foundAttempt);
    res.send(foundAttempt);
});

export default router