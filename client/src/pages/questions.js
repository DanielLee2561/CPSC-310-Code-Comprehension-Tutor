import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './questions.css'
import axios from 'axios';

let state;
let navigate;

// Start Button
const ButtonStart = (props) => {
  const startAttempt = async () => {
    try {
      let request = {"password":state.password};
      let response = await axios.post(`http://localhost:5000/users/${state.username}/questions/${props.question}`, request);
      state.question = props.question;
      state.attempt = response.data.attemptNum;
      navigate("/attempt", {state: state});
    } catch (error) {
      console.error('Start Attempt', error);
    }
  };

  const onClick = () => {
    let attempts = props.attempts;
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
      startAttempt();
    }
  };

  return <button title='Start' className='button start' onClick={onClick}></button>;
}

// View Button
const ButtonView = (props) => {
  const onClick = () => {
    state.question = props.question;
    state.attempt = props.attempt;
    navigate("/attempt", {state: state});
  }

  return <button title='View' className='button view' onClick={onClick}></button>;
}

// Attempt
const Attempt = (name, id, attempt) => {
  let date = null;
  let score = null;
  let duration = null;

  if (attempt != null) {
    if (attempt.endTime != null) {
      date = new Date(attempt.endTime);
      let day = date.getDay();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      date = `${day}-${month}-${year}`;
    }

    if (attempt.testCorrect != null) {
      score = `${attempt.testCorrect}/${attempt.testTotal}`;
    }

    if (attempt.duration != null) {
      duration = `${attempt.duration}s`;
    }
  }

  return (
    <span>
      <span>{name} {id} {date} {score} {duration}</span>
    </span>
  );
}

// Question
const Question = (question) => {
  const id = question.questionId;
  const attempts = question.attempts;
  const [stateExpand, setStateExpand] = useState(false);

  // Expand Button
  const ButtonExpand = () => {
    const onClick = () => {
      setStateExpand(!stateExpand);
    }

    return (
      <input
        className={ stateExpand ? "button expand on" : "button expand off" }
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
        <ul className='attempts'>
          {attempts.map((attempt, attemptID) =>
            <li className='attempt'>
              {Attempt("Attempt", attemptID+1, attempt)}
              <ButtonView question={id} attempt={attemptID+1} />
            </li>
          )}
        </ul>
      );
    }
  }
  
  // Return
  return (
    <div>
      <li className='question'>
        <span>
          <ButtonExpand />
          {Attempt ("Question", id, getBestAttempt(id))}
        </span>
        <ButtonStart question={id} attempts={attempts}/>
      </li>
      <Attempts />
    </div>
  );
}

// Questions
const Questions = (props) => {
  // Variable
  let questions = props.questions;

  // Return
  if (questions != null) {
    return (
      <ul className='questions'>
        {questions.map((question) =>
          <li>{Question(question)}</li>
        )}
      </ul>
    );
  }
}

// Questions Page
const QuestionsPage = () => {
  // Variable
  state = useLocation().state;
  navigate = useNavigate();
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
        console.error('View Questions', error);
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
