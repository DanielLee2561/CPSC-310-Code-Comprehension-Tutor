// Tests related to the API of the question builder page
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
    } catch (err) {
        console.error("Error writing file: " + err);
    }
}

// Tests

// Template test that you may use.
describe("Example test", () => {

    const usersJsonPath = '../server/data/users.json';
    const users_json = readJsonFile(usersJsonPath);
    const questionsJsonPath = '../server/data/questions.json';
    const questions_json = readJsonFile(questionsJsonPath);

    afterEach(function () {
        writeJsonFile(usersJsonPath, users_json);
        writeJsonFile(questionsJsonPath, questions_json);
    });

    it("Testing", async () => {
       // make api call and assertions here
    });
});


// View Question (Researcher) - View specific question's details
describe("View Question (Researcher)", () => {

    const usersJsonPath = '../server/data/users.json';
    const users_json = readJsonFile(usersJsonPath);
    const questionsJsonPath = '../server/data/questions.json';
    const questions_json = readJsonFile(questionsJsonPath);

    afterEach(function () {
        writeJsonFile(usersJsonPath, users_json);
        writeJsonFile(questionsJsonPath, questions_json);
    });

    it("View Question (Researcher) - Success", async () => {
        const username = "Researcher_A";
        const password = "pResearcher_A";
        // Login first
        await axios.put("http://localhost:5000/users/login", {username, password});

        // send API call for viewing a question
        const response = await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/2`,
            {"password": password});
        const data = response.data;

        expect(response.status).to.equal(200);
        expect(data).to.deep.equal({
            "id": 2,
            "code": "function foo(n) {\n  var val = 0;\n  for (i = 0; i < n.length; i++) {\n val += n[i];\n  }\n return val;\n}",
            "tests": [
                {
                    "title": "foo([]) should return 0",
                    "assertion": "chai.expect(global.foo([])).to.equal(0);"
                },
                {
                    "title": "foo([1]) should return 1",
                    "assertion": "chai.expect(global.foo([1])).to.equal(1);"
                },
                {
                    "title": "foo([1, 2]) should return 3",
                    "assertion": "chai.expect(global.foo([1, 2])).to.equal(3);"
                },
                {
                    "title": "foo([-2, 2]) should return 0",
                    "assertion": "chai.expect(global.foo([-2, 2])).to.equal(0);"
                },
                {
                    "title": "foo([5, 13, -4]) should return 14",
                    "assertion": "chai.expect(global.foo([5, 13, -4])).to.equal(14);"
                },
                {
                    "title": "foo([9, 10, 21]) should return 40",
                    "assertion": "chai.expect(global.foo([9, 10, 21])).to.equal(40);"
                }
            ]
        });

    });

    it ("View Question (Researcher) - Not logged in", async () => {
        const username = "Researcher_A";
        const password = "pResearcher_A";

        try {
            await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/2`,
                {"password": password});
            expect.fail();
        } catch (err) {
            expect(err.response.status).to.equal(401);
        }
    });

    it ("View Question (Researcher) - Bad password", async () => {
        const username = "Researcher_A";
        const password = "bad_pass";

        try {
            //login
            await axios.put("http://localhost:5000/users/login", {username, password});
            //view question
            await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/2`,
                {"password": password});
            expect.fail();
        } catch (err) {
            expect(err.response.status).to.equal(401);
        }
    });

    it ("View Question (Researcher) - Non-existent User", async () => {
        const username = "i_do_not_exist";
        const password = "pResearcher_A";

        try {
            //login
            await axios.put("http://localhost:5000/users/login", {username, password});
            //view question
            await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/2`,
                {"password": password});
            expect.fail();
        } catch (err) {
            expect(err.response.status).to.equal(404);
        }
    });

    it ("View Question (Researcher) - Non-Researcher account", async () => {
        const username = "Student_A";
        const password = "pStudent_A";

        try {
            //login
            await axios.put("http://localhost:5000/users/login", {username, password});
            //view question
            await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/2`,
                {"password": password});
            expect.fail();
        } catch (err) {
            expect(err.response.status).to.equal(401);
        }
    });
});

// Template test that you may use.
describe("View Questions (Researcher)", () => {

    const usersJsonPath = '../server/data/users.json';
    const users_json = readJsonFile(usersJsonPath);
    const questionsJsonPath = '../server/data/questions.json';
    const questions_json = readJsonFile(questionsJsonPath);

    afterEach(function () {
        writeJsonFile(usersJsonPath, users_json);
        writeJsonFile(questionsJsonPath, questions_json);
    });

    it("View Questions (Researcher) - Success", async () => {
        // TODO: make api call and assertions here
    });
});