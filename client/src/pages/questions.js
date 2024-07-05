import React from 'react'
import { useNavigate } from 'react-router-dom'
import './questions.css'

// TEMP (Data)

const questions = [1, 2, 3];
const attempts = [1, 2];

// Function

const Question = (id) => {
  const [stateExpand, setStateExpand] = React.useState(false)
  const navigate = useNavigate()

  const onClickExpand = (e) => {
    setStateExpand(!stateExpand)
  }

  const Attempt = (id) => {
    return (
      <li>
        Attempt {id} [DATE] [SCORE] [TIME]
        <button onClick={() => navigate("/")}>View</button>
      </li>
    )
  }
  
  return (
    <li>
      <input
        className={ stateExpand ? "arrow down" : "arrow right" }
        type="button"
        onClick={onClickExpand}
      />
      Question {id} [DATE] [SCORE] [TIME]
      <button onClick={() => navigate("/")}>Start</button>
      <ul>
        { stateExpand ? attempts.map((id) => Attempt(id)) : null }
      </ul>
    </li>
  )
}

const Questions = (props) => {
  return (
    <div>
      <h1>Questions</h1>
      <ul>
          {questions.map((id) => Question(id))}
      </ul>
    </div>
  )
}

export default Questions