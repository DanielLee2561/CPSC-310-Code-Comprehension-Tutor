import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './questions.css'
import axios from 'axios';

// Question
const Question = (question) => {
  // Variable
  const id = question.questionId;
  const attempts = question.attempts;
  const [stateExpand, setStateExpand] = useState(false);
  const navigate = useNavigate();

  // Start Button
  const ButtonStart = () => {
    return <button onClick={onClickStart}>Start</button>;
  }

  // View Button
  const ButtonView = () => {
    return <button onClick={onClickView}>View</button>;
  }

  // Expand Button
  const ButtonExpand = () => {
    return (
      <input
        className={ stateExpand ? "arrow down" : "arrow right" }
        type="button"
        onClick={onClickExpand}
      />
    );
  }

  // Start Button (Click)
  const onClickStart = () => {
    // Variable
    let inProgress = false;

    // In-Progress
    for (let i = 0; i < attempts.length; i++) {
      if (attempts[i].inProgress) {
        inProgress = true;
        break;
      }
    }

    // Effect
    if (inProgress) {
      alert("You cannot start an attempt when there is already an attempt in-progress.");
    } else {
      // TODO (API Start Attempt)
      navigate("/"); // TODO (Attempt Page ic: State)
    }
  }

  // View Button (Click)
  const onClickView = () => {
    navigate("/"); // TODO (Attempt Page ic: State)
  }

  // Expand Button (Click)
  const onClickExpand = () => {
    setStateExpand(!stateExpand);
  }
  
  // Best Attempt
  const getBestAttempt = () => {
    // Variable
    let attemptBest = null;
    
    // Initialization
    if (attempts.length > 0) {
      attemptBest = attempts[0]; 
    }

    // Assignment
    for (let i = 1; i < attempts.length; i++) {
      if (attemptBest.testCorrect < attempts[i].testCorrect) {
        attemptBest = attempts[i];
      }
    }

    // Return
    return attemptBest;
  }

  // Attempt
  const Attempt = (name, id, attempt) => {
    // Variable
    let date = null;
    let score = null;
    let duration = null;

    // Content
    if (attempt != null) {
       // Date
      if (attempt.endTime != null) {
        date = new Date(attempt.endTime);
        let day = date.getDay();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        date = `${day}-${month}-${year}`;
      }

      // Score
      if (attempt.testCorrect != null) {
        score = `${attempt.testCorrect}/${attempt.testTotal}`;
      }

      // Duration
      if (attempt.duration != null) {
        duration = `${attempt.duration}s`;
      }
    }

    return <span>{name} {id} {date} {score} {duration}</span>;
  }

  // Attempts
  const Attempts = () => {
    if (stateExpand) {
      return (
        <ul>
          {attempts.map((attempt, id) =>
            <li>
              {Attempt("Attempt", id+1, attempt)}
              <ButtonView />
            </li>
          )}
        </ul>
      );
    }
  }
  
  // Question
  return (
    <li>
      <ButtonExpand />
      {Attempt ("Question", id, getBestAttempt(id))}
      <ButtonStart />
      <Attempts />
    </li>
  );
}

// Questions
const QuestionsPage = () => {
  // Variable
  const username = useLocation().state.username;
  const password = useLocation().state.password;
  const statusLogin = useLocation().state.statusLogin;
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    // State
    console.log(username);
    console.log(password);
    console.log(statusLogin);

    // Initialize
    const initialize = async () => {
      try {
        let request = {"username":"Student_A", "password":"pStudent_A"};
        let response = await axios.put("http://localhost:5000/users/Student_A/questions", request);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    initialize();
  }, []);

  // Questions
  const Questions = () => {
    if (questions != null) {
      return (
        <ul>
          {questions.map((question) =>
            <li>
              {Question(question)}
            </li>
          )}
        </ul>
      );
    }
  }

  // Return
  return (
    <div>
      <h1>Questions</h1>
      <Questions />
    </div>
  );
}

export default QuestionsPage