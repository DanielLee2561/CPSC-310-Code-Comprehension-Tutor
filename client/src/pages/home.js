// PLACEHOLDER

import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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

  const onButtonClick = () => {

  }

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
    </div>
  )
}

export default Home