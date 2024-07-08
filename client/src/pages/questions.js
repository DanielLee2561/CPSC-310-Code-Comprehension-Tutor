import React from 'react'
import { useNavigate } from 'react-router-dom'
import './questions.css'

// Data (TEMP)
const data = JSON.parse('{"questions":[{"questionId":1,"attempts":[{"description":"description","notes":"note","inProgress":false,"startTime":"2024-07-01T07:00:00.000Z","endTime":"2024-07-01T07:10:00.000Z","duration":600,"generatedCode":"LLM","failingTestCases":"testsFailed","testCorrect":1,"testTotal":2},{"description":"description","notes":"note","inProgress":false,"startTime":"2024-07-01T07:00:00.000Z","endTime":"2024-07-01T07:10:00.000Z","duration":600,"generatedCode":"LLM","failingTestCases":"testsFailed","testCorrect":1,"testTotal":2},{"description":"description","notes":"note","inProgress":true,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":null,"testTotal":null}]},{"questionId":2,"attempts":[{"description":"description","notes":"note","inProgress":false,"startTime":"2024-07-01T07:00:00.000Z","endTime":"2024-07-01T07:10:00.000Z","duration":600,"generatedCode":"LLM","failingTestCases":"testsFailed","testCorrect":1,"testTotal":2}]},{"questionId":3,"attempts":[{"description":"description","notes":"note","inProgress":true,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":null,"testTotal":null}]},{"questionId":4,"attempts":[]},{"questionId":5,"attempts":[]},{"questionId":6,"attempts":[]},{"questionId":7,"attempts":[]},{"questionId":8,"attempts":[]}]}');

// Question
const Question = (question) => {
  // Variable
  const id = question.questionId;
  const attempts = question.attempts;
  const [stateExpand, setStateExpand] = React.useState(false);
  const navigate = useNavigate();

  // Start Button
  const ButtonStart = () => {
    return (
      <button onClick={onClickStart}>Start</button>
    );
  }

  // View Button
  const ButtonView = () => {
    return (
      <button onClick={onClickView}>View</button>
    );
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
  return (
    <div>
      <h1>Questions</h1>
      <ul>{data.questions.map((question) => Question(question))}</ul>
    </div>
  );
}

export default QuestionsPage