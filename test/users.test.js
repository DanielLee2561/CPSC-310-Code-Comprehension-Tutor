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

	afterEach(function() {
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
	
	
});