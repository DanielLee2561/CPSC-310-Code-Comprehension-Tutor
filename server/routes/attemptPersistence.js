import express from "express";
const router = express.Router();

// Data
import {readJsonFile} from "../functions/fileSystemFunctions.js";

const usersJsonPath = './data/users.json';
// using let instead of const so that it can be reloaded after changes
let users_json = readJsonFile(usersJsonPath);
let users = users_json.users;

// Save & Submit Functions
import {save, submit} from "../functions/dataPersistence.js";

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
        - 204 code : Attempt successfully saved/submitted. Submitting may take a while to complete (due to generating
            code and evaluating it)

 */
router.put("/:username/questions/:id", async (req, res) => {
    const username = req.params.username;
    const question_id = req.params.id;

    const password = req.body.password;
    const description = req.body.description;
    const notes = req.body.notes;
    const inProgress = req.body.inProgress;

    let error = "";

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
                    error = save(username, question_id, description, notes);
                } else {
                    error = await submit(username, question_id, description, notes);
                }
                users_json = readJsonFile(usersJsonPath); // JSON was updated due to submit (must reload it)
                users = users_json.users;
                // users = users_json;
                if (error === "") {
                    res.status(400).json({error: error});
                } else {
                    res.status(204).send();
                }
                return;
            }
        }
    }
    res.status(404).json({error: "Could not find user"});

});



// start attempt call here (Kate)
router.post("/:username/questions/:id", async (req, res) => {
    const { username, id: question_id } = req.params;
    const { password } = req.body;

    // Validate request body fields
    if (!password ) {
        res.status(400).json({ error: "Invalid or missing fields in request body" });
        return;
    }

    // Create new attempt object
    const newAttempt = {
            "description": "",
            "notes": "",
            "inProgress": true,
            "startTime": null,
            "endTime": null,
            "duration": 0,
            "generatedCode": "",
            "failingTestCases": "",
            "testCorrect": 0,
            "testTotal": 0  
    };

    try {
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            const questionIndex = users[userIndex].questions.findIndex(q => q.questionId === parseInt(question_id));
            if (questionIndex !== -1) {
                users[userIndex].questions[questionIndex].attempts.push(newAttempt);
                writeJsonFile(usersJsonPath, { usersList: users });
                res.status(204).json('New attempt added successfully.'); 
            } else {
                res.status(404).json({ error: `Question with questionId ${question_id} not found` });
            }
        } else {
            res.status(404).json({ error: `User with username "${username}" not found` });
        }
    } catch (err) {
        console.error('Error adding new attempt:', err);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});


// View Previous Attempt for a Specific Question (Mark)
router.get('/:username/questions/:id/:attemptID', (req, res) => {
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




export default router;
