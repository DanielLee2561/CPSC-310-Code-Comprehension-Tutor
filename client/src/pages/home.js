import React, { useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import './header.css'
import './home.css'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()
  const userInfo = useLocation().state;
  const [showGradebook, setshowGradebook] = useState(false); 

  const isResearcher = async () => {
    await axios.get("http://localhost:5000/users/research/researcher", {
      params: {
        username: userInfo.username,
        password: userInfo.password
      }
    }).then(data => {
      if (data.status === 200) { 
        setshowGradebook(true);
      } else {
        setshowGradebook(false);
      }
    }).catch(err => console.log(err.response.data.message));
  }

  useEffect(() => {
    if (userInfo === null) {
      navigate("/")
    } 
    isResearcher();
  }, [])

  const onHomeButtonClicked = () => {
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    navigate("/profile", {state: userInfo});
  }

  const onQuestionsButtonClicked = () => {
    navigate("/question_bank", {state: userInfo});
  }

  const onQuestionsManagementButtonClicked = () => {
    navigate("/question_management", {state: userInfo});
  }

  const onGradebookButtonClicked = () => {
    navigate("/gradebook", {state: userInfo});
  }

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>Code Comprehension Tutor</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <div className='buttonContainer'>
        <button title="Go To Questions Page" className='questionsButton' onClick={onQuestionsButtonClicked}>Questions</button>
      </div>
      <div className='buttonContainer'>
        <button title="Go To Question Management Page" className='questionsButton' onClick={onQuestionsManagementButtonClicked} style={{ display: showGradebook ? "block" : "none" }}>Question Management</button>
      </div>
      <div className='buttonContainer'>
        <button title="Go To Gradebook Page" className='questionsButton' onClick={onGradebookButtonClicked} style={{ display: showGradebook ? "block" : "none" }}>Gradebook</button>
      </div>
    </div>
  )
}

export default Home