# Project-Groups-06-Lab-A

**Project Name:** Code Comprehension Tutor  
**Group Members:** Daniel Lee, Matija Koprivica, Arshvir Bhandal, Mark Zhu, Chuyi Zheng  

**Description**

&nbsp;&nbsp;&nbsp;&nbsp; The Code Comprehension Tutor allows students to start a quiz, which comprises of several short-answer questions where they describe the purpose of a given JavaScript function. To assess the correctness of the student’s description, it will be encapsulated into a prompt and sent over to Ollama to generate a function corresponding to the given description. Afterwards, it will pass through a series of pre-written test cases to determine if the generated function is functionally-equivalent to the original function. The generated function is then shown to the student and if all test cases passed, then the student can go on to the next question. Otherwise, they will be shown the failing test cases and can refine their description. They will also have the option to write notes about what they are modifying and why, so that when they or perhaps a professor reviews their work, they may understand the reasoning behind the student’s answer.  

&nbsp;&nbsp;&nbsp;&nbsp; The web application will also feature some unique features to set it apart from other similar services. It will feature a competitive learning environment using leaderboards, which will rank users by speed, lowest word count in descriptions, longest streaks, and highest EXP. Users will be able to view the leaderboards and see where they rank among other students. Some of the tracked statistics are also unique features in and of themselves. Streaks will increment daily if the user completes a quiz on that day, encouraging daily learning. If they skip a day, it resets back to zero. Similarly, the EXP statistic is the user’s total score, adjusted for number of attempts needed to achieve a score on a question. A learner’s page and forum will teach users how to do quizzes and allow users to communicate with each other. Lastly, students’ accounts will be secured with a password that they may change at any time.

