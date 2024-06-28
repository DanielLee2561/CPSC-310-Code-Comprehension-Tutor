import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Test from "..\\src\\pages\\test.js";
import MyButton from "./components/MyButton";

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/users").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])  // [] will cause this to only run on first render of the component 

  return (
    <div>
       <MyButton to="test" />
      <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
      {(typeof backendData.users === 'undefinded') ? (
        <p>Loading...</p>
      ): (
        <p> {JSON.stringify(backendData.users)} </p>
      )}
    </div>
  )
}

export default App