import express, { response } from "express";
const router = express.Router();
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import {readJsonFile} from "../functions/fileSystemFunctions.js";

// Load questions from JSON file
// const questionsJsonPath = path.join(process.cwd(), 'data', 'questions.json');
// const usersJsonPath = path.join(process.cwd(), 'data', 'users.json');
const usersJsonPath = './data/users.json';
const questionsJsonPath = './data/questions.json';

let questions;
let users;
//read user json data
// fs.readFile(questionsJsonPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading question.json:', err);
//         return;
//     }
//     try {
//         questions = JSON.parse(data).questions;
//         // console.log(questions);
//     } catch (err) {
//         console.error('Error parsing user.json:', err);
//     }
// });

// fs.readFile(usersJsonPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading question.json:', err);
//         return;
//     }
//     try {
//         users = JSON.parse(data).users;
//         // console.log(questions);
//     } catch (err) {
//         console.error('Error parsing user.json:', err);
//     }
// });

function reload() {
    let questions_json = readJsonFile(questionsJsonPath);
    let users_json = readJsonFile(usersJsonPath);
    questions = questions_json.questions;
    users = users_json.users;
}

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
    reload();
    // console.log(users);
    res.send(questions);
});

//researcher can add a question
router.post('/:username/researcher', (req, res) => {
    reload();
    const { username } = req.params;
    const { password, id, questionCode, tests } = req.body;

    if (!password || !id || !questionCode || !Array.isArray(tests) || tests.length === 0) {
        return res.status(400).json({ error: "password, id, questionCode, and a non-empty array of tests are required." });
    }

    for (let user of users) {
        if (user.username === username) {
            if (user.password !== password) {
                return res.status(401).json({ error: "Incorrect password" });
            }
            if (!user.statusLogin) {
                return res.status(401).json({ error: "User not logged in" });
            }
            if (user.type !== "Researcher") {
                return res.status(401).json({ error: "User is not a researcher" });
            }

            // Construct question and put it in JSON array with a new array for tests
            const newQuestion = { id, questionCode, tests: [...tests] };
            questions.push(newQuestion);
            writeJsonFile(questionsJsonPath, { questions });

            return res.status(200).send("Question successfully posted");
        }
    }

    return res.status(404).json({ error: "User not found" });
});

// found the specific question by questionId
// router.get('/:questionId',(req,res)=>{
//     reload();
//     const { questionId } = req.params;
//     const foundQuestion = questions.find((question)=> question.questionId == questionId);
//     console.log(foundQuestion);
//     res.send(foundQuestion);
// })

// DELETE route to delete a question by questionId
router.delete('/:username/researcher', (req, res) => {
    reload();
    const { username } = req.params;
    const { password, id } = req.body;
    if (!password || !id) {
        return res.status(400).json({ error: "password and id are needed to delete this question" });
    }
    let userFound = false;
    for (let user of users) {
        if (user.username === username) {
            userFound = true;
            if (user.password !== password) {
                return res.status(401).json({ error: "Incorrect password" });
            }
            if (!user.statusLogin) {
                return res.status(401).json({ error: "User not logged in" });
            }
            if (user.type !== "Researcher") {
                return res.status(401).json({ error: "User is not a researcher" });
            }

            // Find the question by questionId and delete it
           
            questions = questions.filter((question) => question.id != id);

            writeJsonFile(questionsJsonPath, { questions });
            return res.send("Deleted the specific question successfully!");
        }
    }
    if (!userFound) {
        return res.status(404).json({ error: "User not found" });
    }
});


// PUT route to edit the question content
router.put('/:username/researcher/questions/:id', (req, res) => {
    reload();
    const { username, id } = req.params;
    const { password, code ,tests } = req.body;

    if (!password || !code || !Array.isArray(tests) || tests.length === 0) {
        return res.status(400).json({ error: "password， code and a non-empty array of tests are required to edit the question" });
    }

    let userFound = false;

    for (let user of users) {
        if (user.username === username) {
            userFound = true;
            if (user.password !== password) {
                return res.status(401).json({ error: "Incorrect password" });
            }
            if (!user.statusLogin) {
                return res.status(401).json({ error: "User not logged in" });
            }
            if (user.type !== "Researcher") {
                return res.status(401).json({ error: "User is not a researcher" });
            }

            // Find the question by questionId
            let question = questions.find((q) => q.id == id);
            if (!question) {
                return res.status(404).json({ error: "Question not found" });
            }
            // Update questionCode and tests
            question.id = id;
            question.code=code;
            question.tests = tests;

            // Write updated questions array back to JSON file
            writeJsonFile(questionsJsonPath, { questions });
            return res.send("Changed the specific question successfully!");
        }
    }

    if (!userFound) {
        return res.status(404).json({ error: "User not found" });
    }
});



// View Question (Researcher) (Specific question code and tests)
router.put("/:username/researcher/questions/:questionId",(req,res)=>{
   reload();

   const username = req.params.username;
   const questionId = Number(req.params.questionId);
   const password = req.body.password;

   let auth = false;

   for (let user of users) {
       if (user.username === username) {
           if (user.password !== password) {
               return res.status(401).json({error: "Wrong password"});
           } else if (!user.statusLogin) {
               return res.status(401).json({error: "User not logged in"});
           } else if (user.type !== "Researcher") {
               return res.status(401).json({error: "User is not 'Researcher'. Cannot access restricted content"});
           } else {
               auth = true;
               break;
           }
       }
   }

   if (!auth) {
       return res.status(404).json({error: "Could not find user with given username"});
   }

   for (let question of questions) {
       if (question.id === questionId) {
           res.status(200).json(question); // also returns id
           return;
       }
   }
   res.status(404).json({error: "Could not find question with given questionId"});
});

// View Questions (Researcher) (All questions in questions.json)
router.put("/:username/researcher/questions",(req,res)=>{
    reload();

    const username = req.params.username;
    const password = req.body.password;
    let auth = false;

    for (let user of users) {
        if (user.username === username) {
            if (user.password !== password) {
                return res.status(401).json({error: "Wrong password"});
            } else if (!user.statusLogin) {
                return res.status(401).json({error: "User not logged in"});
            } else if (user.type !== "Researcher") {
                return res.status(401).json({error: "User is not 'Researcher'. Cannot access restricted content"});
            } else {
                auth = true;
                break;
            }
        }
    }

    if (!auth) {
        return res.status(404).json({error: "Could not find user with given username"});
    }

    return res.status(200).json({questions: questions});

});



// view gradebook (MARK）
router.put("/gradebook/gradebook_data", (req, res) => {
    reload();
        const username = req.body.username;
        const password = req.body.password;
    
        if (!username || !password) return res.status(400).json({error:"element missing."});
    
        // test whether accessing with researcher account
        const check_user = users.find(c => c.username === username);
        if (!check_user) return res.status(404).json({error: "User does not exist."});
        if (check_user.password !== password) return res.status(401).json({error: "Wrong password."});
        if (check_user.type !== "Researcher") return res.status(401).json({error: "Unauthorized to access this feature."});
    
        const gradebook = [];
        
        users.forEach(user => {
            if (user.type !== "Student") return;
    
            const question_list = [];
            
            user.questions.forEach(question => {
                //if (!question.attempts) return;
                //if (!question) return;
    
                let best_attempt = {
                    questionId: question.questionId,
                    testCorrect: -1,
                    testTotal: -1
                };
    
                let highest_score = -1;
                question.attempts.forEach(attempt => {
                    if (attempt.testCorrect === null) return;
                    highest_score = attempt.testCorrect > highest_score ? attempt.testCorrect : highest_score;
                });
    
                // keep testCorrect and testTotal -1 when this question has never been taken or finished, 
                // score will be represented as "N/A"
                if (highest_score !== -1) { 
                    best_attempt.testCorrect = highest_score;
                    best_attempt.testTotal = question.attempts[0].testTotal;
                }
    
                question_list.push(best_attempt);
            });
            
            const a_user = {
                username: user.username,
                questions: question_list
            }
    
            gradebook.push(a_user);
        });
        
        const output = {users: gradebook};
    
        res.status(200).json(output);
    });
export default router;
