import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './header.css'
import './profile.css'

const Profile = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onHomeButtonClicked = () => {
    navigate("/home");
  }

  const onProfileButtonClicked = () => {
    navigate("/profile");
  }

  const onLogoutButtonClicked = () => {
    // API STUFF
    console.log("TEST");
  }

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Homw</span></button>
        <h1 className='headerTitle'>Profile</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <div className='buttonContainer'>
        <button title="Go To Question Page" className='logoutButton' onClick={onLogoutButtonClicked}>Logout</button>
      </div>
    </div>
  )
}

export default Profile