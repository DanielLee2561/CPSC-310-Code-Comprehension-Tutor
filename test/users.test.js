/*
 unit tests for users.js
*/

import axios from "axios";
import {expect} from "chai"
import fs from "fs";

// Read JSON file using given path
function readJsonFile(path) {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file: " + err);
        return null;
    }
}

// Write given data into JSON file located at given path.
function writeJsonFile(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
        console.log('File successfully written');
    } catch (err) {
        console.error("Error writing file: " + err);
    }
}

describe('CodeTutor', () => {

    const usersJsonPath = '../server/data/users.json';
    const usersJSON = readJsonFile(usersJsonPath);

    afterEach(function () {
        writeJsonFile(usersJsonPath, usersJSON);
    });

    describe('Login API', async () => {
        it('Login Success', async () => {
            const username = "Student_A";
            const password = "pStudent_A";
            const res = await axios.put("http://localhost:5000/users/login", {
                username,
                password
            });
            expect(res.status).equal(204);
        });

        it('Login Inccorect Password', async () => {
            const username = "Student_A";
            const password = "pStudent_A2";
            try {
                const res = await axios.put("http://localhost:5000/users/login", {
                    username,
                    password
                });
            } catch (err) {
                expect(err.response.status).equal(401);
            }
        });
    })

    describe("View Questions API", () => {
        it('View Questions Success', async () => {
            const username = "Student_A";
            const password = "pStudent_A";
            const expected_ret = {
                description: "This function always returns 1",
                notes: "Just testing partial success... I know what the function does...",
                inProgress: false,
                startTime: "2024-07-14T18:05:57.721Z",
                endTime: "2024-07-14T18:17:38.296Z",
                duration: 700.575,
                generatedCode: "function foo(x) {\n return \"An error occurred when generating the code\";\n}",
                failingTestCases: "foo([]) should return 0\nfoo([1]) should return 1\nfoo([1, 2]) should return 3\nfoo([-2, 2]) should return 0\nfoo([5, 13, -4]) should return 14\nfoo([9, 10, 21]) should return 40\n",
                testCorrect: 0,
                testTotal: 6,
                question: "function foo(n) {\n  var val = 0;\n  for (i = 0; i < n.length; i++) {\n val += n[i];\n  }\n return val;\n}"
            }
            // Student_A log-in
            await axios.put("http://localhost:5000/users/login", {
                username,
                password
            });
            // Views questions
            const response = await axios.put(
                "http://localhost:5000/users/Student_A/questions/2/attempts/2",
                { password: password });
            const data = response.data;
            expect(response.status).to.eql(200);
            expect(data).to.eql(expected_ret);
        });

        it('View Questions Failure - User not logged in', async () => {
            const password = "pStudent_A";
            const expected_ret = "";

            try {
                const response = await axios.put(
                    "http://localhost:5000/users/Student_A/questions/2/attempts/2",
                    { password: password });
                const data = response.data;
            } catch (err) {
                expect(err.response.status).to.eql(401);
                expect(err.response.data.error).to.eql("User is not currently logged in");
            }
        });

        it('View Questions Failure - Wrong Password', async () => {
            const password = "bad_password";
            const expected_ret = "";

            try {
                const response = await axios.put(
                    "http://localhost:5000/users/Student_A/questions/2/attempts/2",
                    { password: password });
            } catch (err) {
                expect(err.response.status).to.eql(401);
            }
        });
    });


    describe("Save/Submit Attempt API", () => {
        it('Save Attempt Success', async () => {
            const username = "Student_A";
            const password = "pStudent_A";
            const expected_ret = {
                description: "This function always returns 1",
                notes: "Just testing partial success... I know what the function does...",
                inProgress: true,
                startTime: "2024-07-01T07:00:00.000Z",
                endTime: null,
                duration: null,
                generatedCode: null,
                failingTestCases: null,
                testCorrect: null,
                testTotal: null,
                question: "function foo(n) {\n  var val = 0;\n  for (i = 0; i < n.length; i++) {\n val += n[i];\n  }\n return val;\n}"
            }
            // Student_A log-in
            await axios.put("http://localhost:5000/users/login", {
                username,
                password
            });
            // Save question
            const response = await axios.put(
                "http://localhost:5000/users/Student_A/questions/2",
                {
                    password: "pStudent_A",
                    description: "This function always returns 1",
                    notes: "Just testing partial success... I know what the function does...",
                    inProgress: true
                });
            expect(response.status).to.eql(204);
            // View if saved
            const view_response = await axios.put(
                "http://localhost:5000/users/Student_A/questions/2/attempts/3",
                { password: password });
            const view_data = view_response.data;
            expect(view_response.status).to.eql(200);
            expect(view_data).to.eql(expected_ret);
        });

        it('Submit Attempt Success', async () => {
            const username = "Student_A";
            const password = "pStudent_A";
            const expected_ret = {
                description: "This function always returns 1",
                notes: "Just testing partial success... I know what the function does...",
                inProgress: true,
                startTime: "2024-07-01T07:00:00.000Z",
                endTime: null,
                duration: null,
                generatedCode: null,
                failingTestCases: null,
                testCorrect: null,
                testTotal: null,
                question: "function foo(n) {\n  var val = 0;\n  for (i = 0; i < n.length; i++) {\n val += n[i];\n  }\n return val;\n}"
            }
            // Student_A log-in
            await axios.put("http://localhost:5000/users/login", {
                username,
                password
            });

            // Submit question
            const response = await axios.put(
                "http://localhost:5000/users/Student_A/questions/2",
                {
                    password: "pStudent_A",
                    description: "This function always returns 1",
                    notes: "Just testing partial success... I know what the function does...",
                    inProgress: false
                });

            expect(response.status).to.eql(204);

            // View if saved
            const view_response = await axios.put(
                "http://localhost:5000/users/Student_A/questions/2/attempts/3",
                { password: password });
            const view_data = view_response.data;
            expect(view_response.status).to.eql(200);

            // Stuff changes per submit, so just test if it is not in the starting state
            expect(view_data.generatedCode).to.not.eql(null);
            expect(view_data.duration).to.not.eql(null);
            expect(view_data.endTime).to.not.eql(null);
            expect(view_data.failingTestCases).to.not.eql(null);
        });

        it('Save/Submit Questions Failure - User not logged in', async () => {
            const password = "pStudent_A";

            try {
                const response = await axios.put(
                    "http://localhost:5000/users/Student_A/questions/2",
                    {
                        password: "pStudent_A",
                        description: "This function always returns 1",
                        notes: "Just testing partial success... I know what the function does...",
                        inProgress: true
                    });
            } catch (err) {
                expect(err.response.status).to.eql(401);
                expect(err.response.data.error).to.eql("User is not currently logged in");
            }
        });

        it('Save/Submit Questions Failure - Wrong Password', async () => {
            try {
                const response = await axios.put(
                    "http://localhost:5000/users/Student_A/questions/2",
                    {
                        password: "bad_password",
                        description: "This function always returns 1",
                        notes: "Just testing partial success... I know what the function does...",
                        inProgress: true
                    });
            } catch (err) {
                expect(err.response.status).to.eql(401);
            }
        });
    });


});