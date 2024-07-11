# Project-Groups-06-Lab-A

**Project Name:** Code Comprehension Tutor  
**Group Members:** Daniel Lee, Matija Koprivica, Arshvir Bhandal, Mark Zhu, Chuyi Zheng  

**Description**

&nbsp;&nbsp;&nbsp;&nbsp; The Code Comprehension Tutor allows students to complete several short-answer questions where they describe the purpose of a given JavaScript function. To assess the correctness of the student’s description, it will be encapsulated into a prompt and sent over to Ollama to generate a function corresponding to the given description. Afterwards, it will pass through a series of pre-written test cases to determine if the generated function is functionally-equivalent to the original function. The generated function is then shown to the student and if all test cases passed, then the student can go on to the next question. Otherwise, they will be shown the failing test cases and can refine their description. They will also have the option to write notes about what they are modifying and why, so that when they or perhaps a professor reviews their work, they may understand the reasoning behind the student’s answer.  

&nbsp;&nbsp;&nbsp;&nbsp; The web application will feature several unique features, one of which are researcher accounts. These accounts are instantiated manually, and they allow researchers to add, edit, and delete questions. Furthermore, they can view students’ highest scores for each question, and see question and student averages. This may allow researchers to evaluate the effectiveness of the questions and find out which types of functions students find easy or difficult to understand. They may modify the questions or add new ones to give students more to practice with. Another unique feature is a tutorial page, which will contain a video and a short, written guide on how to answer questions on the app. Lastly, students’ accounts will be secured with a password that they may change at any time.

**Test Suite**

  https://drive.google.com/drive/folders/1f2XV9w6UkyC2rSI35xyZcPp23jXBQXw7?usp=sharing
  
**Caution**

1) The Start Button in the Question Bank page has not been implemented.
2) The Save/Submit/Retry Buttons in the Attempt page have been implemented, but they do not work in Docker. However, you can still view the information related to each attempt in the frontend.
3) A student can register an account, but they are not able to answer questions. This is because we need to implement a function that enables a 'new' user to know what questions exist in the backend. However, an existing user can access the question bank.
4) If you intend to test the prototype, please use an account that already exists in the backend.
  - Username: Student_A
  - Password: pStudent_A

## Docker Compose

1) Install "Docker Desktop"
2) Open "Docker Desktop"
3) In top-level of project folder, execute without quotes "docker compose up -d".
4) Open "http://localhost:5000/"
