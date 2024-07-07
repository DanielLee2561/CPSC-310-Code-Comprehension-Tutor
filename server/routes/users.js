import express, { response } from "express";
const router=express.Router();
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import jwt from "jsonwebtoken";

// Load users from JSON file
// const usersJsonPath = path.join(process.cwd(), 'data', 'user.json');

// TODO: Use these functions?
import {readJsonFile, writeJsonFile} from "../functions/fileSystemFunctions.js";
const usersJsonPath = './data/users.json';
const users_json = readJsonFile(usersJsonPath);
// const users = users_json.users;
let users = users_json;


// let users;
// //read user json data
// fs.readFile(usersJsonPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading user.json:', err);
//         return;
//     }
//     try {
//          users = JSON.parse(data).users;
//
//         console.log(users);
//     } catch (err) {
//         console.error('Error parsing user.json:', err);
//     }
// });
//
// // if the data from the url, can use fetch to get the data from the frontend
// // fetch('../data/user.json')
// //         .then((response)=>response.json())
// //         .then((json)=>console.log(json));
// // console.log(users);
//
// // write to the user json data
// const writeJsonFile = (filePath, data) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//     } catch (err) {
//         console.error('Error writing JSON file:', err);
//     }
// }

router.get('/', (req, res) => {
    // console.log(users);
    res.send(users);
});

//register a user
router.post('/register',(req,res)=>{
    const{username,password}=req.body;
    if (!username || !password){
        return res.status(400).json({error:"username and password are required."});
    }

    for (let user of users){
        if (user.username===username){
           res.status(409).json({error:"the username already exists"});
           return;
        }
    }
    // construct user and put in json array
    let newUser = {};
    newUser = req.body; // both username and password
    newUser.type = "Student";
    newUser.statusLogin = false;
    users.push({...newUser});
    writeJsonFile(usersJsonPath, { users });
    res.send("just post");
});


//login 
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        let foundUser = false;

        for (let user of users) {
            if (user.username === username) {
                foundUser = true;

                const token=jwt.sign({
                    username:user.username
                }, "adfgdfgdfgf",{
                    expiresIn:100*60*60*24*7
                })
                if (user.password === password) {
                    user.statusLogin = true;
                    fs.writeFileSync(usersJsonPath, JSON.stringify(users, null, 2));
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 3600000
                    });
                    return res.status(204).json({ message: "Login successful." });
                } else {
                    return res.status(401).json({ error: "Password is incorrect." });
                }
            }
        }

        if (!foundUser) {
            return res.status(404).json({ error: "Username not found." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    }
});

//logout account-----need to test later with frontend 
router.post('/logout', (req, res) => {
  res.clearCookie("token").status(200).json({message:"Logout successful"})
});


router.get('/:username',(req,res)=>{
    const { username } = req.params;
    const foundUser = users.find((user)=> user.username === username);
    res.send(foundUser);
})

router.delete('/:username',(req,res)=>{
    const { username } = req.params;
    //username to delete

    users =users.filter((user)=>user.username !== username);
    writeJsonFile(usersJsonPath, { users });
    res.send("delete successful!");
})

// here is to change the password  (need to test)
router.put('/:username',(req,res)=>{
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;
    //username to delete
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "Missing username, old password, or new password" });
    }
    let userFound = false;
    let passwordUpdated = false;
    for (let user of users) {
        if (user.username === username) {
            userFound = true;
            if (user.password === oldPassword) {
                user.password = newPassword;
                passwordUpdated = true;
                break;
            } else {
                return res.status(400).json({ error: "Old password does not match" });
            }
        }
    }

    if (!userFound) {
        return res.status(404).json({ error: "User not found" });
    }

    if (passwordUpdated) {
        writeJsonFile(usersJsonPath, { users });
        return res.status(200).json({ message: "Password updated successfully" });
    }
});

// TODO: Stub for getting specific attempt data.
router.get("/Student_A/questions/2/attempts/1", (req, res) => {
    res.status(200).json(users[0].questions[1].attempts[0])
});

// View Questions (list of all questions that user started & attempted, along with all of their attempts)
router.get("/:username/questions", (req, res) => {
    const username = req.params.username;
    const password = req.body.password;
    
    for (let user of users) {
        if (user.username === username) {
            if (user.password !== password) {
                res.status(401).json({error: "Incorrect password"});
                return;
            } else if (!user.statusLogin) {
                res.status(401).json({error: "User is not currently logged in"});
                return;
            } else {
                res.json({questions: user.questions});
                return;
            }
        }
    }
    res.status(404).json({error: "Could not find user"});
});


export default router;
