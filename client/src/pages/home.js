// PLACEHOLDER

import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const changePage = () => {
    navigate("/questions")
  }

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <h1>Home</h1>
      </div>
      <div>
        <button onClick={changePage}>Questions</button>
      </div>
    </div>
  )
}

export default Home