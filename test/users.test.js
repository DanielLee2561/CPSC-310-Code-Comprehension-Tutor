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
        // console.log('File successfully written');
    } catch (err) {
        console.error("Error writing file: " + err);
    }
}

describe('Login', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	// describe('Login API', async () => {
	it('Login Success', async () => {
		const username = "Student_A";
		const password = "pStudent_A";
		const res = await axios.put("http://localhost:5000/users/login", {
			username,
			password
		});
		const testUsersJSON = readJsonFile(usersJsonPath);
		expect(testUsersJSON.users[0].statusLogin).equal(true);
		for (let i = 0; i < testUsersJSON.users.length; i++) {
			if (testUsersJSON.users[i].username !== username) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
		}
		expect(res.status).equal(204);

		await axios.put("http://localhost:5000/users/logout", {
			username
		});
	});

	it('Login Success Researcher', async () => {
		const username = "Researcher_A";
		const password = "pResearcher_A";
		const res = await axios.put("http://localhost:5000/users/login", {
			username,
			password
		});
		const testUsersJSON = readJsonFile(usersJsonPath);
		expect(testUsersJSON.users[3].statusLogin).equal(true);
		for (let i = 0; i < testUsersJSON.users.length; i++) {
			if (testUsersJSON.users[i].username !== username) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
		}
		expect(res.status).equal(204);

		await axios.put("http://localhost:5000/users/logout", {
			username
		});
	});

	it('Login Inccorect Password', async () => {
		const username = "Student_A";
		const password = "pStudent_A2";
		try {
			const res = await axios.put("http://localhost:5000/users/login", {
				username,
				password
			});
			expect.fail();
		} catch (err) {
			const testUsersJSON = readJsonFile(usersJsonPath);
			for (let i = 0; i < testUsersJSON.users.length; i++) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
			expect(err.response.status).equal(401);
		}
	});

	it('Login Inccorect Username', async () => {
		const username = "Student_A2";
		const password = "pStudent_A";
		try {
			const res = await axios.put("http://localhost:5000/users/login", {
				username,
				password
			});
			expect.fail();
		} catch (err) {
			const testUsersJSON = readJsonFile(usersJsonPath);
			for (let i = 0; i < testUsersJSON.users.length; i++) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
			expect(err.response.status).equal(404);
		}
	});

	it('Login No Username', async () => {
		const username = "";
		const password = "pStudent_A";
		try {
			const res = await axios.put("http://localhost:5000/users/login", {
				username,
				password
			});
			expect.fail();
		} catch (err) {
			const testUsersJSON = readJsonFile(usersJsonPath);
			for (let i = 0; i < testUsersJSON.users.length; i++) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
			expect(err.response.status).equal(400);
		}
	});

	it('Login No Password', async () => {
		const username = "Student_A";
		const password = "";
		try {
			const res = await axios.put("http://localhost:5000/users/login", {
				username,
				password
			});
			expect.fail();
		} catch (err) {
			const testUsersJSON = readJsonFile(usersJsonPath);
			for (let i = 0; i < testUsersJSON.users.length; i++) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
			expect(err.response.status).equal(400);
		}
	});
	// })
	
	
});

describe('Register', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
});


describe('Logout', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	it('Logout Success', async () => {
		// Logging In 
		const username = "Student_A";
		const password = "pStudent_A";
		let res = await axios.put("http://localhost:5000/users/login", {
			username,
			password
		});
		expect(res.status).equal(204);

		// Logging Out
		res = await axios.put("http://localhost:5000/users/logout", {
			username
		});
		const testUsersJSON = readJsonFile(usersJsonPath);
		for (let i = 0; i < testUsersJSON.users.length; i++) {
			expect(testUsersJSON.users[i].statusLogin).equal(false);
		}
		expect(res.status).equal(204);
	});

	it('Logout Wrong Username', async () => {
		// Logging In 
		let username = "Student_A";
		const password = "pStudent_A";
		let res = await axios.put("http://localhost:5000/users/login", {
			username,
			password
		});
		expect(res.status).equal(204);

		// Logging Out
		try {
			username = "something else";
			res = await axios.put("http://localhost:5000/users/logout", {
				username
			});
		} catch (err) {
			const testUsersJSON = readJsonFile(usersJsonPath);
			expect(testUsersJSON.users[0].statusLogin).equal(true);
			for (let i = 1; i < testUsersJSON.users.length; i++) {
				expect(testUsersJSON.users[i].statusLogin).equal(false);
			}
			expect(err.response.status).equal(500);
		}
		username = "Student_A"
		res = await axios.put("http://localhost:5000/users/logout", {
			username
		});
	});
	

	it('Logout Success Researcher', async () => {
		// Logging In 
		const username = "Researcher_A";
		const password = "pResearcher_A";
		let res = await axios.put("http://localhost:5000/users/login", {
			username,
			password
		});
		expect(res.status).equal(204);

		// Logging Out
		res = await axios.put("http://localhost:5000/users/logout", {
			username
		});
		const testUsersJSON = readJsonFile(usersJsonPath);
		for (let i = 0; i < testUsersJSON.users.length; i++) {
			expect(testUsersJSON.users[i].statusLogin).equal(false);
		}
		expect(res.status).equal(204);
	});
});

describe('Change Password', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Delete Account', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Start Attempt', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Save and Submit Attempt', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('View Attempt', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('View Questions', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Delete Question', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Add Question', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('View Question (Researcher)', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('Edit Question', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('View Questions (Researcher)', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});

describe('View Gradebook', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });
	
	
	
	
});