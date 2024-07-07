import * as chai from 'chai'; // Needed to run tests on generated code.
import {readJsonFile} from "./fileSystemFunctions.js";

const questionsJsonPath = './data/questions.json';
const question_json = readJsonFile(questionsJsonPath);
const questions = question_json.questions;

// Returns the tests associated with the given question_id (int).
// If the question with the given question_id could not be found, returns null instead.
function getQuestionTests(question_id) {
    for (let question of questions) {
        if (question.id == question_id) {
            return question.tests; // array of tests with title and assertion
        }
    }
    // Cannot find question
    return null;
}

/*
    Function: evaluateCode

    Description:
        - Evaluated the given code based on the tests defined by the question with the given question_id

    Parameters:
        - question_id (int): The ID of the question the user is answering. This is used to find the
            appropriate tests to evaluate the code from.
        - generated_code (string): The LLM generated code based on the user's description of what the question
            function does. It is generated via the generateCode function.

    Returns:
        - An object with the following properties:
            - testsTotal (int): The total number of tests that the generated code was run up against.
            - testsCorrect (int): The number of tests that the generated code passed.
            - failingTestCases (string): A concatenated string of all the titles of the tests that
                the generated code failed. Each test title is separated by \n.
 */
function evaluateCode(question_id, generated_code) {
    const tests = getQuestionTests(question_id);
    let totalTests = 0;
    let passingTests = 0;
    let failingTestCases = "";
    if (tests === undefined || tests == null) {
        // TODO: What should it return? This case may happen when a researcher creates a question
        //  but does not populate it with tests.
        return null;
    } else {
        eval("global.foo = " + generated_code); //global.foo is now usable
        for (const test of tests) {
            totalTests++;
            try {
                eval(test.assertion);
                passingTests++;
            } catch (err) {
                console.log(err);
                failingTestCases += test.title + "\n";
            }
        }
        return {
            testTotal: totalTests,
            testCorrect: passingTests,
            failingTestCases: failingTestCases
        };
    }
}

export {evaluateCode};