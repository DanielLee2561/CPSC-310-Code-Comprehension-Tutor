// Data
import {readJsonFile, writeJsonFile} from "./fileSystemFunctions.js";
const usersJsonPath = "./data/users.json";
const questionsJsonPath = "./data/questions.json";
const users_json = readJsonFile(usersJsonPath);
const users = users_json.users;
const question_json = readJsonFile(questionsJsonPath);
const questions = question_json.questions;

// Generating & Evaluating code
import {generateCode} from "./generateCode.js";
import {evaluateCode} from "./evaluateCode.js";

// Helpers

// TODO: Unit test this in-depth
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
    const question = questions.find(q => q.id == question_id);
    return question ? question.code : "";
  }
  

// Persistence

// Submits the attempt. Generates and evalutes code based on user's description.
// Sets the attempts inProgress boolean to false & saves other data to the attempt.
async function submit(username, question_id, desc, notes) {
    // I re-find user so that it is possible to save to users.json without overwriting the data.
    // Its weird, but I'm happy to make it cleaner if there is a fix/better way to do this
    
    try {
        const user=users.find(u=>users.username===username );
        if (!user){
            return "Somehow could not find the user, but it was confirmed to exist before...";
        }
        const question = user.questions.find(q => q.questionId == question_id);
        if (!question) return "Could not find question";
        const attempt = user.questions[i].attempts[user.questions[i].attempts.length - 1];
        if (!attempt.inProgress){
            return   "ERROR: latest attempt is not in progress, but was submitted??"
        }
        const endTime = new Date(); // generates endTime on submission -> endtime not affected by gen-time
        const questionFunction = getQuestionFunction(question_id);
        const numParameters = countNumParameters(questionFunction);
        const generated_code = await generateCode(desc, numParameters);
        const evaluatedAttempt = evaluateCode(question_id, generated_code);
        if (evaluatedAttempt) {
            attempt.inProgress = false; // TODO: uncomment (this just for testing purposes)
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
            // return "Submission successful";
            console.log(attempt);
            return attempt;
            }else {
                return "There was an error when the generated code passed through the test cases";
              }
            } 
            catch (error) {
              console.error(error);
              return "Internal server error occurred";
            }
        }

// Saves the description and notes to the user with the provided username, under their latest, in progress
// attempt for the question with the given question_id.
// It is assumed that the attempt has inProgress === true and that the user with the given username exists.
function save(username, question_id, desc, notes) {
    try {
      const user = users.find(u => u.username === username);
      if (!user) return "Somehow could not find the user, but it was confirmed to exist before...";
  
      const question = user.questions.find(q => q.questionId == question_id);
      if (!question) return "Could not find question";
  
      const attempt = question.attempts[question.attempts.length - 1];
      console.log("attempt"+attempt)
      if (attempt.inProgress) {
        attempt.description = desc;
        attempt.notes = notes;
        writeJsonFile(usersJsonPath, users_json);
        return attempt;
        }else {
        return "Attempt not in progress, but was saved?"
      }
  
    } catch (error) {
      console.error(error);
      return "Internal server error occurred";
    }
  }
export {save, submit};