import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './questions.css'
import axios from 'axios';

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

// Question
const Question = (question) => {
  // Variable
  const id = question.questionId;
  const attempts = question.attempts;
  const navigate = useNavigate();
  const [stateExpand, setStateExpand] = useState(false);

  // Start Button
  const ButtonStart = () => {
    const onClick = () => {
      let inProgress = false;

      for (let i = 0; i < attempts.length; i++) {
        if (attempts[i].inProgress) {
          inProgress = true;
          break;
        }
      }

      if (inProgress) {
        alert("You cannot start an attempt when there is already an attempt in-progress.");
      } else {
        // TODO (API Start Attempt)
        navigate("/"); // TODO (Attempt Page ic: State)
      }
    }

    return <button onClick={onClick}>Start</button>;
  }

  // View Button
  const ButtonView = (props) => {
    const state = useLocation().state;
    state.question = props.question;
    state.attempt = props.attempt;

    const onClick = () => {
      navigate("/attempt", {state: state});
    }

    return <button onClick={onClick}>View</button>;
  }

  // Expand Button
  const ButtonExpand = () => {
    const onClick = () => {
      setStateExpand(!stateExpand);
    }

    return (
      <input
        className={ stateExpand ? "arrow down" : "arrow right" }
        type="button"
        onClick={onClick}
      />
    );
  }
  
  // Best Attempt
  const getBestAttempt = () => {
    let attemptBest = null;
    
    if (attempts.length > 0) {
      attemptBest = attempts[0]; 
    }

    for (let i = 1; i < attempts.length; i++) {
      if (attemptBest.testCorrect < attempts[i].testCorrect) {
        attemptBest = attempts[i];
      }
    }

    return attemptBest;
  }

  // Attempts
  const Attempts = () => {
    if (stateExpand) {
      return (
        <ul>
          {attempts.map((attempt, attemptID) =>
            <li>
              {Attempt("Attempt", attemptID+1, attempt)}
              <ButtonView question={id} attempt={attemptID}/>
            </li>
          )}
        </ul>
      );
    }
  }
  
  // Return
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
const Questions = (props) => {
  // Variable
  let questions = props.questions;

  // Return
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

// Questions Page
const QuestionsPage = () => {
  // Variable
  const state = useLocation().state;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  
  // Home Button
  const onHomeButtonClicked = () => {
    navigate("/home", {state: state});
  }

  // Profile Button
  const onProfileButtonClicked = () => {
    navigate("/profile", {state: state});
  }

  // State
  useEffect(() => {
    if (state === null) {
      navigate("/");
    } else {
      console.log(state);
    }
  }, [state])

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        let request = {"username":state.username, "password":state.password};
        let response = await axios.put(`http://localhost:5000/users/${state.username}/questions`, request);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    initialize();
  }, []);

  // Return
  return (
    <div>
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>Questions</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <Questions questions={questions}/>
    </div>
  );
}

export default QuestionsPage