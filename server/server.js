// REFERENCE: https://www.youtube.com/watch?v=GR5-aao7Y-0
// REFERENCE: https://www.youtube.com/watch?v=6CjbezdbB8o
// REFERENCE: https://www.youtube.com/watch?v=5lK_iFJsWv4&t=5s


import path from "path";      // Needed? If not, remove. If yes, delete this comment
import express from "express";

const app = express();
const port = 5000;
app.use(express.json());

// Data
import {readJsonFile} from "./fileSystemFunctions.js";
const usersJsonPath = './data/users.json';
// const questionsJsonPath = './data/questions.json';
let users_json = readJsonFile(usersJsonPath); // use let instead of const so that it can be reloaded after changes
let users = users_json.users;
// const question_json = readJsonFile(questionsJsonPath); //
// const questions = question_json.questions;

// Save & Submit Functions
import {save, submit} from "./attemptPersistence.js";

/*
    Save/Submit Attempt

    Description:
        - Saves the current attempt to the backend. If specified, it can also submit the attempt, which
        saves even more information and generates a function based on the user's description, passes this
        code to the question's tests, and evaluates the user's code comprehension

    Parameters:
        - Endpoint Parameters:
            - username (string): the username of the user who is saving/submitting their attempt
            - id (int): the question id of the question that the user is saving/submitting their attempt for
        - Request Body parameters:
            - password (string): the user's password (used for authentication)
            - description (string): the user's description of the question's function
            - notes (string): notes that the user wrote (use "" if there are no notes)
            - inProgress (boolean): whether the question is still in progress or not after this request.
                - If true  -> this attempt is saved and can be continued later
                - If false -> this attempt is submitted (generate code and evaluation) and
                    cannot be saved/submitted again

    Returns:
        - 401 code : Incorrect password or user is not currently logged in (statusLogin bool set to false)
        - 404 code : User with the given username could not be found
        - 200 code : Attempt successfully saved/submitted. Submitting may take a while to complete (due to generating
            code and evaluating it)

 */
app.put("/users/:username/questions/:id", async (req, res) => {
    const username = req.params.username;
    const question_id = req.params.id;

    const password = req.body.password;
    const description = req.body.description;
    const notes = req.body.notes;
    const inProgress = req.body.inProgress;

    // used to show the confirmation object when saved/submitted (testing purposes only, but we can keep if needed)
    let message;

    for (let user of users) {
        if (user.username === username) {
            if (user.password !== password) {
                res.status(401).json({error: "Incorrect password"});
                return;
            } else if (!user.statusLogin) {
                res.status(401).json({error: "User is not currently logged in"});
                return;
            } else {
                if (inProgress) {
                    message = save(username, question_id, description, notes);
                } else {
                    message = await submit(username, question_id, description, notes);
                }
                users_json = readJsonFile(usersJsonPath); // JSON was updated due to submit (must reload it)
                users = users_json.users;
                res.status(200).json({message: message, users});
                return;
            }
        }
    }
    res.status(404).json({error: "Could not find user"});

});

///////////////////////////////////////////////////////////////

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


// TODO: This is failing on my end, I'm not sure what it should do so I commented it out for now
// // let root = require('path').join(__dirname, 'build');
// let root = path.join(__dirname, 'build');
// // root = require('path').join(__dirname, '..', "client", "build");
// root = path.join(__dirname, '..', "client", "build");
// app.use(express.static(root));
// console.log(express.static(root));
// app.use('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
// });


// Opening the server to listen on port 5000
app.listen(port, () => {
    console.log("Server running on port " + port);
});