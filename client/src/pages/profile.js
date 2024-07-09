// REFERENCE: https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
// https://stackoverflow.com/questions/71500670/uselocation-hook-keeps-states-even-on-hard-refresh

import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import './header.css'
import './profile.css'

const Profile = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()
  const userInfo = useLocation().state;

  useEffect(() => {
    if (userInfo === null) {
      navigate("/")
    } 
  })

  const onHomeButtonClicked = () => {
    console.log(userInfo);
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    console.log(userInfo);
    navigate("/profile", {state: userInfo});
  }

  const onLogoutButtonClicked = async () => {
    const username = userInfo.username;
    await axios.put("http://localhost:5000/users/logout", {
      username
    });
    window.history.replaceState({}, '');
    navigate("/", {
      state: null
    });
  }

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
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