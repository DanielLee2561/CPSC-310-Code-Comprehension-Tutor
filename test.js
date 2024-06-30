const express = require("express");
const app = express();

app.use(express.json());

var courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
    res.send([1,12,3,33,4]);
});

app.post("/api/courses", (req, res) => {
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Name is required or invaild'); // bad request
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

app.put("api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course api has not been found.'); // not found

    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Name is required or invaild'); // bad request
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

app.delete("api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course api has not been found.'); // not found

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course api has not been found.'); // not found
    res.send(course);
});

app.listen(3000, () => console.log("Listening on port 3000..."));