// Data
import {readJsonFile, writeJsonFile} from "./fileSystemFunctions.js";
const usersJsonPath = "./data/users.json";
const questionsJsonPath = "./data/questions.json";
let users_json = readJsonFile(usersJsonPath);
let users = users_json.users;
let questions_json = readJsonFile(questionsJsonPath);
let questions = questions_json.questions;

// Generating & Evaluating code
import {generateCode} from "./generateCode.js";
import {evaluateCode} from "./evaluateCode.js";

// Reloads the data variables to reflect the current state of the
// users and questions JSON files.
function reloadDataVars() {
    users_json = readJsonFile(usersJsonPath);
    users = users_json.users;
    questions_json = readJsonFile(questionsJsonPath);
    questions = questions_json.questions;
}

// Helpers

// TODO: Unit test this in-depth?
// Returns the number of parameters that the given foo function has.
// May or may not actually be needed (depending if we want the LLM to know explicitly the name and number
// of parameters it must generated, which could reduce the number of errors when testing)
function countNumParameters(question) {
    let parameter = question.split("foo(")[1].split(")")[0];
    if (parameter.length === 0) {
        return 0;
    }
    return parameter.split(",").length;
}

// Returns the question's function based on the question id. If question could not be found,
// returns the empty string ("") instead.
// TODO: Unit test this in-depth needed?
function getQuestionFunction(question_id) {
    // DO NOT put reloadDataVars here.
    // It is already guaranteed to be up-to-date when this function is called, but
    // if you call it then the attempt info WILL NOT be saved.
    for (let question of questions) {
        if (question.id == question_id) {
            return question.code;
        }
    }
    return "";
}

// Persistence

// Submits the attempt. Generates and evalutes code based on user's description.
// Sets the attempts inProgress boolean to false & saves other data to the attempt.
async function submit(username, question_id, desc, notes) {
    reloadDataVars();
    // I re-find user so that it is possible to save to users.json without overwriting the data.
    // Its weird, but I'm happy to make it cleaner if there is a fix/better way to do this
    for (let user of users) {
        if (user.username === username) {
            for (let i = 0; i < user.questions.length; i++) {
                if (user.questions[i].questionId == question_id) {
                    const attempt = user.questions[i].attempts[user.questions[i].attempts.length - 1];
                    if (attempt.inProgress) {
                        const endTime = new Date(); // generates endTime on submission -> endtime not affected by gen-time

                        const questionFunction = getQuestionFunction(question_id);
                        const numParameters = countNumParameters(questionFunction);
                        const generated_code = await generateCode(desc, numParameters);
                        const evaluatedAttempt = evaluateCode(question_id, generated_code);
                        // if evaluatedAttempt does not have an invalid/error message (based on the gencode) -> then
                        // evaluatedAttempt contains num passing tests, num all tests, failing test cases

                        if (evaluatedAttempt) {
                            attempt.inProgress = false;
                            attempt.description = desc;
                            attempt.notes = notes;
                            attempt.endTime = endTime;
                            const startTime = new Date(attempt.startTime);
                            attempt.duration = (endTime - startTime) / 1000;
                            attempt.generatedCode = generated_code;
                            attempt.testCorrect = evaluatedAttempt.testCorrect;
                            attempt.testTotal = evaluatedAttempt.testTotal;
                            attempt.failingTestCases = evaluatedAttempt.failingTestCases;
                            writeJsonFile(usersJsonPath, users_json);
                            reloadDataVars();
                            return attempt;
                        } else {
                            // TODO: what to do in this situation?
                            return "There was an error when the generated code passed through the test cases";
                        }
                    } else {
                        return "ERROR: latest attempt is not in progress, but was submitted??"
                    }
                }
            }
            return "Could not find question";
        }
    }
    return "Somehow could not find the user, but it was confirmed to exist before...";
}

// Saves the description and notes to the user with the provided username, under their latest, in progress
// attempt for the question with the given question_id.
// It is assumed that the attempt has inProgress === true and that the user with the given username exists.
function save(username, question_id, desc, notes) {
    reloadDataVars();
    // I re-find user so that it is possible to save to users.json without overwriting the data.
    // Its weird, but I'm happy to make it cleaner if there is a fix/better way to do this
    for (let user of users) {
        if (user.username === username) {
            for (let i = 0; i < user.questions.length; i++) {
                if (user.questions[i].questionId == question_id) {
                    const attempt = user.questions[i].attempts[user.questions[i].attempts.length - 1];
                    if (attempt.inProgress) {
                        attempt.description = desc;
                        attempt.notes = notes;
                        writeJsonFile(usersJsonPath, users_json);
                        reloadDataVars();
                        return;
                    } else {
                        return "Attempt not in progress, but was saved?";
                    }
                }
            }
            return "Could not find question";
        }
    }
    return "Somehow could not find the user, but it was confirmed to exist before...";
}

export {save, submit};