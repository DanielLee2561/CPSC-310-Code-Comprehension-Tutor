const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.use(express.static('public'));
app.use(express.json());
//var submissions;

var submissions = [
    {
        attempt: 1,
        input_description: "description1",
        input_note: "note1",
        tests_failed: "",
        in_progress: true,
        time_start: "Sat, Jun 20 2024 14:50:00 GMT",
        time_end: "Sat, Jun 20 2024 15:00:00 GMT",
        tests_correct: 4,
        tests_total: 6
    },
];
/*
fs.readFile('./backend/storage.json', (err, data) => {
    if (err) {
        return console.error(err);
    }
    submissions = JSON.parse(data);
});
*/

/*
var data = fs.readFileSync('../backend/storage.json');
var submissions = JSON.parse(data);
*/

/*
app.get('/users/username/questions/id/:attempt', (req, res) => {
    const submission = submissions.find(c => c.attempt === parseInt(req.params.attempt));
    if (!submission) res.status(404).send('The submission api has not been found.'); // not found
    res.send(submission);
});
*/

app.get('/users/username/questions/id', (req, res) => {
    if (!submissions) res.status(404).send('The submissions api has not been found.'); // not found
    res.status(200).send(submissions);
});

// starting the question
app.post('/users/username/questions/id', (req, res) =>{
    if (!req.body.input_description) return res.status(400).send('Submission is not availables'); // bad request
    if (submissions.find(c => c.attempt === submissions.length).in_progress === true)
        return res.status(400).send(`Cannot start new attempt when last attempt isn't finished`); // bad request

    const submission = {
        attempt: submissions.length + 1,
        input_description: req.body.input_description,
        input_note: req.body.input_note,
        tests_failed: "",
        in_progress: true,
        time_start: new Date().toUTCString(),
        time_end: "",
        tests_correct: 0,
        tests_total: 10  // placeholder
    };

    submissions.push(submission);
    res.status(200).send(submissions);
    //updateInfo(submissions);
});

// submitting and save the question (TODO)

app.put('/users/username/questions/id', (req, res) => {
    const submission = submissions.find(c => c.attempt === submissions.length);
    if (!submission) return res.status(404).send('The submission api has not been found.'); // not found
    if (!req.body.input_description) return res.status(400).send('Submission is not availables'); // bad request

    submission.input_description = req.body.input_description;
    submission.input_note = req.body.input_note;
    submission.in_progress = req.body.in_progress;
    submission.time_end = new Date().toUTCString();

    //console.log(req.body);
    res.status(200).send(submissions);
    //updateInfo(submissions);
});



/*
const response = await fetch(``, {
    method: "PUT",
    body: JSON.stringify({
        input_description: "description2",
        input_note: "note2",
        in_progress: true
    }),
    headers: new Headers().append("Content-Type", "application/json"),
});
*/


function updateInfo(sub) {
    fs.writeFile('../backend/storage.json', JSON.stringify(sub), (err) => {
        if (err) return console.error(err);
    });
}
