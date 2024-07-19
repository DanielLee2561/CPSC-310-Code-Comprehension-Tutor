import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './questions.css'
import axios from 'axios';

let state;
let navigate;

const ButtonHome = () => {
  const onClick = () => {navigate("/home", {state: state});}
  return <button title="Go To Home Page" className='homeButton' onClick={onClick}><span className='headerSpan'>Home</span></button>;
}

const ButtonProfile = () => {
  const onClick = () => {navigate("/profile", {state: state});}
  return <button title="Go To Profile Page" className='profileButton' onClick={onClick}><span className='headerSpan'>Profile</span></button>;
}

const getBestAttempt = (attempts) => {
  let attemptBest = null;
  let scoreBest = 0;
  let timeBest = Infinity;

  for (let i = 0; i < attempts.length; i++) {
    let attemptNew = attempts[i];
    let scoreNew = attemptNew.testCorrect;
    let timeNew = attemptNew.duration;
    if (attemptNew.inProgress == false && scoreBest <= scoreNew && timeBest > timeNew) {
      attemptBest = attemptNew;
      scoreBest = attemptBest.testCorrect;
    }
  }

  return attemptBest;
}

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
        title={ stateExpand ? "Hide Attempts" : "Show Attempts" }
        className={ stateExpand ? "button expand on" : "button expand off" }
        type="button"
        onClick={onClick}
      />
    );
  }

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
      <li className='attempt question'>
        <span>
          <ButtonExpand />
          {Attempt ("Question", id, getBestAttempt(attempts))}
        </span>
        <ButtonStart question={id} attempts={attempts}/>
      </li>
      <Attempts />
    </div>
  );
}

const Questions = (props) => {
  let questions = props.questions;

  if (questions != null) {
    return (
      <ul className='questions'>
        {questions.map((question) =>
          <li>
            {Question(question)}
          </li>
        )}
      </ul>
    );
  }
}

const QuestionsPage = () => {
  state = useLocation().state;
  navigate = useNavigate();
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    if (state === null) {
      navigate("/");
    } else {
      console.log(state);
    }
  }, [state])

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

  return (
    <div>
      <div className="header">
        <ButtonHome />
        <h1 className='headerTitle'>Questions</h1>
        <ButtonProfile />
      </div>
      <Questions questions={questions}/>
    </div>
  );
}

export default QuestionsPage
