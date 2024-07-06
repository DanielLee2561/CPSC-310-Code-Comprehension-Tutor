// REFERENCE: https://www.youtube.com/watch?v=GR5-aao7Y-0

// dependencies
const express = require("express");
// const fs = require("fs");
const app = express();
const port = 5000;

// middleware
app.use(express.json());

// data
const users_json = require("..\\server\\data\\users.json");
const questions_json = require("..\\server\\data\\questions.json");

const users = users_json.users;
// API Calls

// Get all user info
app.get("/users", (req, res) => {
    res.json(users_json);
})


// Register a user
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password; // password validation left up to frontend (no empty string, 5+ chars?)

    // Check if user of same username already exists
    for (let user of users) {
        if (user.username === username) {
            res.status(409).json({users_json}); //.send()
            return;
        }
    }
    // construct user and put in json array
    let newUser = {};
    newUser = req.body; // both username and password
    newUser.type = "Student";
    newUser.statusLogin = false;
    newUser.questions = [];

    users.push(newUser);

    res.status(201).json(users_json); //.send();
});

// TODO: Login
app.put("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password; 
    // Look for username
    for (let user of users) {
        if (user.username === username) {
            // Check password
            if (user.password === password) {
                user.statusLogin = true;
                res.status(200).json({login:true});
                console.log(users_json); // For testing can be removed
                return;
            } else {
                res.status(409).json({login:false});
                console.log(users_json); // For testing can be removed
                return;
            }
        }
    }
    // If user name doesn't exist
    res.status(400).json({login:false});
    console.log(users_json); // For testing can be removed
    return;
});

// TODO: Logout

// Change account password
app.put("/users/:username", (req, res) => {
    const username = req.params.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    for (let user of users) {
        // if user is found, then
        if (user.username === username) {
            // if the passwords match too -> 200 & changed password
            if (user.password === oldPassword) {
                user.password = newPassword;
                res.status(200).json(user);
            } else {
                res.status(400).json(user);
            }
            return;
        }
    }
    // if user could not be found
    res.status(400).json(users_json);
});

// Delete a user
app.delete("/users/:username", (req, res) => {
    const username = req.params.username;
    const password = req.body.password;

    // if there are no users, send out 400 code
    if (users.length === 0) {
        res.status(400).json(users_json);
        return;
    }
    // Linear search through all users
    for (let i = 0; i < users.length; i++) {
        if (users[i].username !== username) {
            // if username cannot be found -> 400
            res.status(400).json(users_json);
        } else if (users[i].password !== password) {
            // if password doesn't match -> 400
            res.status(400).json(users_json);
        } else {
            // if username and password are correct -> delete & 204
            users.splice(i, 1);
            res.status(204).send();
        }
    }
});

// View Previous Attempt for a Specific Question
app.get('/users/:username/questions/:id/:attemptID', (req, res) => {
    const username = req.params.username;
    const password = req.body.password;
    const questionId = req.params.id;
    const attemptId = req.params.attemptID;

    if (!username || !questionId || !password || !attemptId)
        return res.status(400).json({error:"element missing."});

    const user = users.find(c => c.username === username);
    if (!user) return res.status(404).send('User is not found.');
    if (user.password !== password) return res.status(401).send('Unauthorized to access this data');

    const question = user.questions.find(c => c.questionId === parseInt(questionId));
    if (!question) return res.status(404).send('Question is not found.');

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

    if (!foundAttempt) return res.status(404).send('Attempt is not found.');

    res.status(200).json(foundAttempt);
});



// Opening the server to listen on port 3001
app.listen(port, () => {
    console.log("Server running on port " + port);
});