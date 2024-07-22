import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './questions.css'
import './questionsManagement.css'
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

// Attempt
const Attempt = (name, id) => {

  return (
    <span>
      <span>{name} {id}</span>
    </span>
  );
}

const Edit = (props) => {
  const onEditClick = () => {
    state.question = props.qId;
    navigate("/question_build", {state: state});
  }

  return (
    <div className='editDiv'>
      <span>
        <input className={'editButton'} type="button" onClick={onEditClick} value={"Edit"}/>
      </span>
    </div>
  );
}

const Delete = (props) => {

  async function showDeleteNotification() {
    if (window.confirm("Are you sure you would like to delete Question " + state.question)) {
      const username = state.username;
      const password = state.password;
      const id = state.question;
      try {
      const res = await axios.delete('http://localhost:5000/questions/' + username + '/researcher', {
        data: {
          password,
          id
        }});
        window.location.reload();
      } catch (err) {
        console.log(err.response.data.message);
      }
    } 
  }

  const onDeleteClick = () => {
    state.question = props.qId;
    showDeleteNotification();
  }

  return (
    <span>
      <input type="button" className={'editButton'} onClick={onDeleteClick} value={"Delete"}/>
    </span>
  );
}

// Question
const Question = (question) => {
  const id = question.id;
  
  // Return
  return (
    <div>
      <li className='attempt question'>
        <span>
          {Attempt ("Question", id)}
        </span>
        <Edit qId={id} />
        <Delete qId={id} />
      </li>
    </div>
  );
}

const Add = () => {
  const onAddButtonClicked = () => {
    console.log("ADD QUESTION API HERE");
    window.location.reload();
  }

  return <div className='buttonContainer'> 
      <button title="Go To Question Builder Page" className='addButton' onClick={onAddButtonClicked}>Add Question</button>
    </div>
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
        let response = await axios.get(`http://localhost:5000/questions`, request);
        setQuestions(response.data);
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
        <h1 className='headerTitle'>Questions Management</h1>
        <ButtonProfile />
      </div>
      <Questions questions={questions}/>
      <Add />
    </div>
  );
}

export default QuestionsPage
