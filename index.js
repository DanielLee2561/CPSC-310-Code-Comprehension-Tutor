import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import questionsRoutes from './routes/questions.js';
import ollamaRoutes from './routes/ollama.js';

const app=express();

const PORT=5000;

app.use(bodyParser.json());
app.use('/users', usersRoutes);
app.use('/questions', questionsRoutes);
app.use('/questions/ollama', ollamaRoutes);

app.get('/',(req,res)=>{
    res.send("hello world")
});
app.listen(PORT,()=>console.log(`console.log("Server running on port: http://localhost:${PORT}`))
