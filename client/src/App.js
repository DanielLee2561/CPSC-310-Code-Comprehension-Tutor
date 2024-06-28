import React, { useEffect, useState } from 'react'

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
      {(typeof backendData.users === 'undefinded') ? (
        <p>Loading...</p>
      ): (
        <p> {JSON.stringify(backendData.users)} </p>
      )}
    </div>
  )
}

export default App