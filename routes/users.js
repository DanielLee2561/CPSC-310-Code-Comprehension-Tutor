import express, { response } from "express";
const router=express.Router();
import fs from 'fs';
import path from 'path';
import session from 'express-session';

// Load users from JSON file
const usersJsonPath = path.join(process.cwd(), 'data', 'user.json');


let users;
//read user json data
fs.readFile(usersJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading user.json:', err);
        return;
    }
    try {
        users = JSON.parse(data).users;
        console.log(users);
    } catch (err) {
        console.error('Error parsing user.json:', err);
    }
});

// if the data from the url, can use fetch to get the data from the frontend
// fetch('../data/user.json')
//         .then((response)=>response.json())
//         .then((json)=>console.log(json));
// console.log(users);

// write to the user json data
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

router.get('/', (req, res) => {
    // console.log(users);
    res.send(users);
});

//register a user
router.post('/',(req,res)=>{
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
    users.push({...newUser});
    writeJsonFile(usersJsonPath, { users });
    res.send("just post");
});

//logout account-----need to test later with frontend 
// app.post('/api/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send('Failed to logout');
//         }
//         res.clearCookie('connect.sid');
//         res.send('Logout successful');
//     });
// });


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



export default router;
