import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './header.css'
import './home.css'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()
  const userInfo = useLocation().state;

  useEffect(() => {
    if (userInfo === null) {
      navigate("/")
    } 
  })

  // console.log(useLocation().state.username);
  // console.log(useLocation().state.password);
  // console.log(useLocation().state.loggedIn);

  const test = useLocation();
  const onHomeButtonClicked = () => {
    console.log(userInfo);
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    console.log(userInfo);
    navigate("/profile", {state: userInfo});
  }

  const onQuestionsButtonClicked = () => {
    navigate("/questions", {state: userInfo});
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