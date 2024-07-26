import express, { response } from "express";
const router=express.Router();
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import jwt from "jsonwebtoken";

// Load users from JSON file
// const usersJsonPath = path.join(process.cwd(), 'data', 'user.json');

import {readJsonFile, writeJsonFile} from "../functions/fileSystemFunctions.js";
const usersJsonPath = './data/users.json';
const questionsJsonPath = './data/questions.json';
let users_json = readJsonFile(usersJsonPath);
// const users = users_json.users;
let users = users_json.users;
let questions_json = readJsonFile(questionsJsonPath);
let questions = questions_json.questions;

// Reloads the data variables to reflect the current state of the
// users and questions JSON files.
function reloadDataVars() {
    users_json = readJsonFile(usersJsonPath);
    users = users_json.users;
    questions_json = readJsonFile(questionsJsonPath);
    questions = questions_json.questions;
}

// let users;
// //read user json data
// fs.readFile(usersJsonPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading user.json:', err);
//         return;
//     }
//     try {
//          users = JSON.parse(data).users;
//
//         console.log(users);
//     } catch (err) {
//         console.error('Error parsing user.json:', err);
//     }
// });
//
// // if the data from the url, can use fetch to get the data from the frontend
// // fetch('../data/user.json')
// //         .then((response)=>response.json())
// //         .then((json)=>console.log(json));
// // console.log(users);
//
// // write to the user json data
// const writeJsonFile = (filePath, data) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//     } catch (err) {
//         console.error('Error writing JSON file:', err);
//     }
// }

router.get('/', (req, res) => {
    // console.log(users);
    reloadDataVars();
    res.send(users);
});

router.get('/research/researcher', (req, res) => {
    reloadDataVars();
    const { username, password } = req.query;
    for (let user of users){
        if ((user.username===username) && (user.password===password)){
            if (user.type === "Researcher") {
                return res.status(200).send();
            } else {
                return res.status(401).send();
            }
        }
    }
    return res.status(401).send();
});


//register a user
router.post('/register',(req,res)=>{
    // const usersList = users.users
    reloadDataVars();
    const{username,password}=req.body;
    if (!username || !password){
        return res.status(400).json({error:"username and password are required."});
    }

    for (let user of users){
        if (user.username===username){
           return res.status(400).json({error:"the username already exists"});
        }
    }
    // construct user and put in json array
    let newUser = {};
    newUser = req.body; // both username and password
    newUser.type = "Student";
    newUser.statusLogin = false;
    newUser.questions = [];
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        newUser.questions.push({
            "questionId": question.id,
            "attempts": []
        })
    }
    users.push({...newUser});
    writeJsonFile(usersJsonPath, { "users": users });
    reloadDataVars();
    return res.status(201).send("just post");
});

function compareIds(a, b) {
    return a.questionId - b.questionId;
}

function buildUserQuestions(user, questions) {
    let existingQuestions = [];
    for (let i = 0; i < questions.length; i++) {
        existingQuestions.push(questions[i].id)
    }
    for (let i = 0; i < user.questions.length; i++) {
        if (!existingQuestions.includes(user.questions[i].questionId)) {
            user.questions.splice(i, 1);
        }    
    }
    let userQuestions = [];
    for (let i = 0; i < user.questions.length; i++) {
        userQuestions.push(user.questions[i].questionId)
    }
    for (let i = 0 ; i < questions.length; i++) {
        if (!userQuestions.includes(questions[i].id)) {
            user.questions.push({
                "questionId": questions[i].id,
                "attempts": []
            });
        }
    }
    user.questions.sort(compareIds);
}

router.put('/gradebook/questions', (req, res) => {
    try {
        reloadDataVars();
        for (let user of users) {
            buildUserQuestions(user, questions);
        }
        fs.writeFileSync(usersJsonPath, JSON.stringify({"users": users}, null, 2));
        return res.status(200).send();
    } catch (err) {
        return res.status(500).send();
    }
})

//login
router.put('/login', (req, res) => {
    // const usersList = users.users
    reloadDataVars();
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        let foundUser = false;

        for (let user of users) {
            if (user.username === username) {
                foundUser = true;

                const token=jwt.sign({
                    username:user.username
                }, "adfgdfgdfgf",{
                    expiresIn:100*60*60*24*7
                })
                if (user.password === password) {
                    user.statusLogin = true;
                    buildUserQuestions(user, questions);
                    fs.writeFileSync(usersJsonPath, JSON.stringify({"users": users}, null, 2));
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 3600000
                    });
                    reloadDataVars();
                    return res.status(204).json({ message: "Login successful." });
                } else {
                    return res.status(401).json({ error: "Password is incorrect." });
                }
            }
        }

        if (!foundUser) {
            return res.status(404).json({ error: "Username not found." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    }
});

//logout account-----need to test later with frontend 
router.put('/logout', (req, res) => {
    // const usersList = users.users
    reloadDataVars();
    const{username}=req.body;
    // res.clearCookie("token").status(200).json({message:"Logout successful"})

    for (let user of users){
        if (user.username===username){
            user.statusLogin = false;
            fs.writeFileSync(usersJsonPath, JSON.stringify({"users": users}, null, 2));
            res.clearCookie("token").status(204).json({message:"Logout successful"});
            reloadDataVars();
            return;
        }
    }
    return res.status(500).json({ error: "Internal server error." });
});


router.get('/:username',(req,res)=>{
    reloadDataVars();
    const { username } = req.params;
    const foundUser = users.find((user)=> user.username === username);
    res.send(foundUser);
})


//delete the account api
router.delete('/:username',(req,res)=>{
    reloadDataVars();
    const { username } = req.params;
    const { password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    let userFound = false;
    let userDeleted = false;

    for (let user of users) {
        if (user.username === username) {
            userFound = true;
            if (user.password === password) {
                users = users.filter(u => u.username !== username);
                userDeleted = true;
                break;
            } else {
                return res.status(400).json({ error: "Password does not match" });
            }
        }
    }

    if (!userFound) {
        return res.status(400).json({ error: "User not found" });
    }
    if (userDeleted) {
        writeJsonFile(usersJsonPath, { users });
        reloadDataVars();
        return res.status(201).send(); 
    } else {
        return res.status(500).json({ error: "Failed to delete user" });
    }
});


// here is to change the password 
router.put('/:username', (req, res) => {
    reloadDataVars();
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "Missing username, old password, or new password" });
    }

    let userFound = false;
    let passwordUpdated = false;

    for (let user of users) {
        if (user.username === username) {
            userFound = true;
            if (user.password === oldPassword) {
                user.password = newPassword;
                passwordUpdated = true;
                break;
            } else {
                return res.status(400).json({ error: "Old password does not match" });
            }
        }
    }

    if (!userFound) {
        return res.status(400).json({ error: "User not found" });
    }

    if (passwordUpdated) {
        writeJsonFile(usersJsonPath, { users });
        reloadDataVars();
        return res.status(204).json({ message: "Password updated successfully" }); // change to 200 to see message
    } else {
        return res.status(500).json({ error: "Failed to update password" });
    }
});

// Getting specific attempt data in a question
router.put("/:username/questions/:questionID/attempts/:attemptID", (req, res) => {
    reloadDataVars();

    const username = req.params.username;
    const password = req.body.password;
    const questionId = req.params.questionID;
    const attemptId = req.params.attemptID;

    if (!username || !password || !questionId || !attemptId)
        return res.status(400).json({error:"element missing."});

    const user = users.find(c => c.username === username);
    if (!user) return res.status(404).json({error:'User is not found.'});
    if (user.password !== password) return res.status(401).json({error:'Unauthorized to access this data'});

    const question = user.questions.find(c => c.questionId === parseInt(questionId));
    if (!question) return res.status(404).json({error:'Question is not found.'});

    const attempts = question.attempts;

    let foundAttempt;
    let index = 1;

    for (let attempt of attempts) {
        if (index === parseInt(attemptId)) {
            foundAttempt = attempt;
            break;
        }
        index++;
    }

    if (!foundAttempt) return res.status(404).json({error:'Attempt is not found.'});

    // Find question function code and put in foundAttempt object
    const questionFunction = questions.find(c => c.id === parseInt(questionId));
    if (!questionFunction) return res.status(404).jsoon({error:'Question is not found.'});
    foundAttempt.question = questionFunction.code ? questionFunction.code : "";

    res.status(200).json(foundAttempt);
});

// View Questions (list of all questions that user started & attempted, along with all of their attempts)
router.put("/:username/questions", (req, res) => {
    reloadDataVars();

    const username = req.params.username;
    const password = req.body.password;
    
    for (let user of users) {
        if (user.username === username) {
            if (user.password !== password) {
                res.status(401).json({error: "Incorrect password"});
                return;
            } else if (!user.statusLogin) {
                res.status(401).json({error: "User is not currently logged in"});
                return;
            } else {
                res.json({questions: user.questions});
                return;
            }
        }
    }
    res.status(404).json({error: "Could not find user"});
});

export default router;
