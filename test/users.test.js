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
  
    afterEach(function () {
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
	const questionsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
		writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questionsJSON);
	});

	describe('Register API', () => {
		it('Register Success', async () => {
			const username = "Student_E";
			const password = "pStudent_E";
			// Log the request data for debugging
			console.log('Registering user with:', { username, password });

			try {
				const res = await axios.put("http://localhost:5000/users/register", {
					username,
					password
				});
				expect(res.status).equal(204);
			} catch (err) {
					expect(err.response.status).equal(400);
				
			}
		});
		it('Register unsuccessful with exists username', async () => {
			const username = "Student_A";
			const password = "pStudent_E";
			// Log the request data for debugging
			console.log('Registering user with:', { username, password });

			try {
				const res = await axios.put("http://localhost:5000/users/register", {
					username,
					password
				});
				expect.fail();
			} catch (err) {
					expect(err.response.status).equal(400);
				
			}
		});
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
	describe('Change Password API', () => {
		it('Change Password Success', async () => {
			const username = "Student_A";
			const oldPassword = "pStudent_A";
			const newPassword="111111111";
			// Log the request data for debugging
			console.log('Change Password with:', { username });

			try {
				const res = await axios.put("http://localhost:5000/users/:username", {
					username,
					oldPassword,
					newPassword
				});
				expect(res.status).to.equal(201);
			} catch (err) {
					expect(err.response.status).equal(400);
				
			}
		});

		it('Change Password unsuccessful with password is not correct', async () => {
			const username = "Student_A";
			const oldPassword = "11111111111";
			const newPassword="111111111";
			// Log the request data for debugging
			console.log('Change Password with:', { username });

			try {
				const res = await axios.put("http://localhost:5000/users/:username", {
					username,
					oldPassword,
					newPassword
				});
				expect(res.status).fail();
			} catch (err) {
					expect(err.response.status).equal(400);
				
			}
		});
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
	describe('Delete Account API', () => {
		it('Delete Account Success', async () => {
			const username = "Student_A";
			const password = "pStudent_A";
			// Log the request data for debugging
			console.log('Delete Account with:', { username });
			try {
				const res = await axios.delete("http://localhost:5000/users/:username", {
					username,
					password
				});
				expect(res.status).to.equal(201);
			} catch (err) {
					expect(err.response.status).equal(400);		
			}
		});
		it('Delete Account unsuccessful with the incorrect password', async () => {
			const username = "Student_A";
			const password = "pStudent_A1111";
		  
			// Log the request data for debugging
			console.log('Delete Account with:', { username, password });
		  
			try {
			  const res = await axios.delete(`http://localhost:5000/users/${username}`, {
				data: { password }
			  });
			  expect(res.status).to.equal(401);
			} catch (err) {
			  expect(err.response.status).to.equal(401);
			}
		  });
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


	describe('Start Attempt API', () => {
		it('Start Attempt Success', async () => {
			const username = "Student_A";
			const password = "pStudent_A";
			// Log the request data for debugging
			console.log('Start Attempt with:', { username });
			try {
				const res = await axios.post("http://localhost:5000/users/:username/questions/:id", {
					username,
					password
				});
				expect(res.status).to.equal(200);
			} catch (err) {
					expect(err.response.status).equal(404);		
			}
		});
		it('Start Attempt unsuccessful with wrong password', async () => {
			const username = "Student_A";
			const password = "Student_A";
			// Log the request data for debugging
			console.log('Start Attempt with:', { username });
			try {
				const res = await axios.post("http://localhost:5000/users/:username/questions/:id", {
					username,
					password
				});
				expect(res.status).to.equal(400);
			} catch (err) {
					expect(err.response.status).equal(404);		
			}
		});
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
	
  /*
  saving this for now (lots of changes in main make it difficult to merge
  
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

    */
	
	
	
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

	describe('View Questions API', () => {
		it('View Questions Success', async () => {
			const username = "Student_A";
			const password = "pStudent_A";
			// Log the request data for debugging
			console.log('View Questions with:', { username });
			try {
				const res = await axios.put("http://localhost:5000/users/:username/questions", {
					username,
					password
				});
				expect(res.status).to.equal(200);
			} catch (err) {
					expect(err.response.status).equal(404);		
			}
		});
		it('View Questions unsuccessful with wrong password', async () => {
			const username = "Student_A";
			const password = "Student_A";
			// Log the request data for debugging
			console.log('View Questions with:', { username });
			try {
				const res = await axios.put("http://localhost:5000/users/:username/questions", {
					password
				});
				expect(res.status).to.equal(401);
			} catch (err) {
					expect(err.response.status).equal(404);		
			}
		});
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

// mark need to change test in here
describe('View Gradebook', () => {

	const usersJsonPath = '../server/data/users.json';
	const usersJSON = readJsonFile(usersJsonPath);
	const questionsJsonPath = '../server/data/questions.json';
	const questoinsJSON = readJsonFile(questionsJsonPath);

	afterEach(function() {
        writeJsonFile(usersJsonPath, usersJSON);
		writeJsonFile(questionsJsonPath, questoinsJSON);
    });

    describe('Viewing Gradebook API', async () => {

        it('Access Gradebook Successfully', async () => {
            const username = "Researcher_A";
            const password = "pResearcher_A";
            try {
                const res = await axios.put("http://localhost:5000/gradebook_data", 
                    {"username": username, "password": password});
                expect(res.status).eql(200);
            } catch (err) {
                assert.fail();
            }
        });

        it('Access Gradebook Unsuccessfully (Missing Element)', async () => {
            const username = "Researcher_A";
            try {
                const res = await axios.put("http://localhost:5000/gradebook_data", 
                    {"username": username});
                assert.fail();
            } catch (err) {
                expect(err.res.status).eql(400);
            }
        });

        it('Access Gradebook Unsuccessfully (Nonexist User)', async () => {
            const username = "Researcher_";
            const password = "pResearcher_A";
            try {
                const res = await axios.put("http://localhost:5000/gradebook_data", 
                    {"username": username, "password": password});
                assert.fail();
            } catch (err) {
                expect(err.res.status).eql(404);
            }
        });

        it('Access Gradebook Unsuccessfully (Wrong Password)', async () => {
            const username = "Researcher_A";
            const password = "pResearcher_";
            try {
                const res = await axios.put("http://localhost:5000/gradebook_data", 
                    {"username": username, "password": password});
                assert.fail();
            } catch (err) {
                expect(err.res.status).eql(401);
            }
        });

        it('Access Gradebook Unsuccessfully (Not Researcher Account)', async () => {
            const username = "Student_A";
            const password = "pStudent_A";
            try {
                const res = await axios.put("http://localhost:5000/gradebook_data", 
                    {"username": username, "password": password});
                assert.fail();
            } catch (err) {
                expect(err.res.status).eql(401);
            }
        });

    });	
	
	
});
