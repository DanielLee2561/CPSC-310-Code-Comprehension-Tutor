import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './header.css'
import './home.css'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()
  // navigate("/login")

  const test = useLocation().state;
  useEffect(() => {
    if (test === null) {
        navigate("/")
    } else {
      console.log(test.username);
      console.log(test.password);
      console.log(test.loggedIn);
    }
  })

  // console.log(useLocation().state.username);
  // console.log(useLocation().state.password);
  // console.log(useLocation().state.loggedIn);

  const onHomeButtonClicked = () => {
    navigate("/home");
  }

  const onProfileButtonClicked = () => {
    navigate("/profile");
  }

  const onQuestionsButtonClicked = () => {
    navigate("/question_bank", {
      state: {
        "username": test.username,
        "password": test.password,
        "statusLogin": test.loggedIn
      }
    });
  }

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Homw</span></button>
        <h1 className='headerTitle'>Code Comprehension Tutor</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <div className='buttonContainer'>
        <button title="Go To Question Page" className='questionsButton' onClick={onQuestionsButtonClicked}>Questions</button>
      </div>
    </div>
  )
}

export default Home