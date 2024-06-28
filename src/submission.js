
function submission() {
    var des = document.getElementById("description").value;
    var note = document.getElementById("notes").value;
    document.getElementById("description").value = "";
    document.getElementById("test").innerHTML = des;
    api({description: des, note: note,});
}


function api(sub) {
    const express = require("express");
    const app = express();
    const fs = require("fs");
    const path = '../backend/storage.json';

    app.put(`/users/{username}/questions/{id}`, (req, res) => {
        //const sub = courses.find(c => c.id === parseInt(req.params.id));
        if (req.body.description === '') {
            app.status(400).send('description cannot be empty');
        }
        fs.readFile(path, 'utf8', (err, data) => {
            data = JSON.parse( data );
            data[`${data.length}`] = submission;
            console.log(data);
            res.json(data);
        });
        //submission.description = req.body.description;
        //submission.note = req.body.note;
    });

    app.get(`/users/{username}/questions/test`, (req, res) => {
        
    });

    app.listen(3000, () => console.log(`Listening to port 3000...`));
}