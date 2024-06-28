# Project-Groups-06-Lab-A

**Project Name:** Code Comprehension Tutor  
**Group Members:** Daniel Lee, Matija Koprivica, Arshvir Bhandal, Mark Zhu, Chuyi Zheng  

**Description**

&nbsp;&nbsp;&nbsp;&nbsp; The Code Comprehension Tutor allows students to complete several short-answer questions where they describe the purpose of a given JavaScript function. To assess the correctness of the student’s description, it will be encapsulated into a prompt and sent over to Ollama to generate a function corresponding to the given description. Afterwards, it will pass through a series of pre-written test cases to determine if the generated function is functionally-equivalent to the original function. The generated function is then shown to the student and if all test cases passed, then the student can go on to the next question. Otherwise, they will be shown the failing test cases and can refine their description. They will also have the option to write notes about what they are modifying and why, so that when they or perhaps a professor reviews their work, they may understand the reasoning behind the student’s answer.  

&nbsp;&nbsp;&nbsp;&nbsp; The web application will feature several unique features, one of which are researcher accounts. These accounts are instantiated manually, and they allow researchers to add, edit, and delete questions. Furthermore, they can view students’ highest scores for each question, and see question and student averages. This may allow researchers to evaluate the effectiveness of the questions and find out which types of functions students find easy or difficult to understand. They may modify the questions or add new ones to give students more to practice with. Another unique feature is a tutorial page, which will contain a video and a short, written guide on how to answer questions on the app. Lastly, students’ accounts will be secured with a password that they may change at any time.

## Notes and Instructions  

Alt layout with react and api

Use 'npm run dev' in server folder to start api \
Use 'npm start' in client folder to start frontend

Video Reference: https://www.youtube.com/watch?v=w3vs4a03y3I
Had some trouble becuase of this lol https://stackoverflow.com/a/73268060

