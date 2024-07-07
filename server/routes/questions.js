import express, { response } from "express";
const router = express.Router();
import fs from 'fs';
import path from 'path';
import session from 'express-session';

// Load questions from JSON file
const questionsJsonPath = path.join(process.cwd(), 'data', 'question.json');


let questions;
//read user json data
fs.readFile(questionsJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading question.json:', err);
        return;
    }
    try {
        questions = JSON.parse(data).questions;
        // console.log(questions);
    } catch (err) {
        console.error('Error parsing user.json:', err);
    }
});

// if the data from the url, can use fetch to get the data from the frontend
// fetch('../data/question.json')
//         .then((response)=>response.json())
//         .then((json)=>console.log(json));
// console.log(questions);

// write to the user json data
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

router.get('/', (req, res) => {
    // console.log(users);
    res.send(questions);
});

//add a question
router.post('/',(req,res)=>{
    const{questionId,questionCode,test}=req.body;
    if (!questionId || !questionCode || !test){
        return res.status(400).json({error:"questionId, questionCode and test are required."});
    }

    // construct question and put in json array
    const newQuestion={questionId,questionCode,test};
    questions.push({...newQuestion});
    writeJsonFile(questionsJsonPath, { questions });
    res.send("just post a question");
});

//logout account-----need to test later with frontend 
// app.post('/api/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send('Failed to logout');
//         }
//         res.clearCookie('connect.sid');
//         res.send('Logout successful');
//     });
// });

// found the specific question by questionId
router.get('/:questionId',(req,res)=>{
    const { questionId } = req.params;
    const foundQuestion = questions.find((question)=> question.questionId == questionId);
    console.log(foundQuestion);
    res.send(foundQuestion);
})

//delete a question by questionId
router.delete('/:questionId',(req,res)=>{
    const { questionId } = req.params;
    questions =questions.filter((question)=>question.questionId != questionId);
    writeJsonFile(questionsJsonPath, { questions });
    res.send("delete the specific question successful!");
})

// PUT route to update questionCode and test for a specific questionId
router.put('/:questionId', (req, res) => {
    const { questionId } = req.params;
    const { questionCode, test } = req.body;

    // Check if newQuestionCode or newTest are missing
    if (!questionCode || !test) {
        return res.status(400).json({ error: "Missing newQuestionCode or newTest" });
    }

    // Find the question by questionId
    console.log(questions);
    let question = questions.find((q) => q.questionId == questionId);
    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    // Update questionCode and test
    question.questionCode = questionCode;
    question.test = test;

    // Write updated questions array back to JSON file
    writeJsonFile(questionsJsonPath, { questions });

    res.send("Changed the specific question successfully!");
});
export default router;
