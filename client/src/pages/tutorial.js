import React, { useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../css/header.module.css'
import stylesB from '../css/tutorial.module.css'

const Tutorial = (props) => {
  const navigate = useNavigate()
  const userInfo = useLocation().state;
  useEffect(() => {
    if (userInfo === null) {
      navigate("/")
    } 
  }, [])

  const onHomeButtonClicked = () => {
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    navigate("/profile", {state: userInfo});
  }

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>Tutorial</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <div className='videoContainer'>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/R4JVNCeY1oo?si=RI0Zqph2RSlAu-me" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
        </iframe>
      </div>

      <div className='textContainer'>
        <p>Tutorial text: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo  ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis  dis parturient montes, nascetur ridiculus mus. Donec quam felis,  ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa  quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate  eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,  justo. </p>
      </div>
    </div>
  )
}

export default Tutorial