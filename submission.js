const { NONAME } = require("dns");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

var submissions = [
    {
        attempt: 1, 
        input_description: "description1", 
        input_note: "note1",
        tests_failed: "",
        in_progress: false,
        time_start: "Sat Jun 20 2024 14:50:00 GMT-0700",
        time_end: "Sat Jun 20 2024 15:00:00 GMT-0700",
        tests_correct: 4,
        tests_total: 6
    },
];
/*
app.get('/users/username/questions/id/:attempt', (req, res) => {
    const submission = submissions.find(c => c.attempt === parseInt(req.params.attempt));
    if (!submission) res.status(404).send('The submission api has not been found.'); // not found
    res.send(submission);
});
*/


app.get('/users/username/questions/id', (req, res) => {
    if (!submissions) res.status(404).send('The submissions api has not been found.'); // not found
    res.send(submissions);
});

// starting the question
app.post('/users/username/questions/id', (req, res) =>{
    if (!req.body.input_description) return res.status(400).send('Submission is not availables'); // bad request

    const submission = {
        attempt: submissions.length + 1,
        input_description: req.body.input_description,
        input_note: req.body.input_note, 
        tests_failed: "",
        in_progress: true,
        time_start: Date(),
        time_end: "",
        tests_correct: 0,
        tests_total: 10  // placeholder
    };

    submissions.push(submission);
    res.send(submissions);
});

// submitting the question (TODO)

app.put('/users/username/questions/id', (req, res) => {
    const submission = submissions.find(c => c.attempt === submissions.length);
    if (!submission) return res.status(404).send('The submission api has not been found.'); // not found
    if (!req.body.input_description) return res.status(400).send('Submission is not availables'); // bad request

    submission.input_description = req.body.input_description;
    submission.input_note = req.body.input_note;
    submission.in_progress = false;
    submission.time_end = Date();

    res.send(submissions);
});


app.listen(port, () => console.log(`Listening on port ${port}...`));