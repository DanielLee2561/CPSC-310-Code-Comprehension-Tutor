import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import Test from "../src/pages/test.js";
import MyButton from "./components/MyButton";
import Question from './pages/question_page.js';
import './App.css';

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
  /*
  const submit = () => {
      //var des = document.getElementById("description").textContent;
      //var note = document.getElementById("notes").textContent;
      //document.getElementById("description").textContent = "";
      //document.getElementById("test").innerHTML = des;
      const a = React.createElement('p', {}, des);
      const test = ReactDOM.createRoot(document.getElementById('test'));
      test.render(a);
  }
      */

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/question' element={<Question/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

    /*
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

     */
    /*
    return (
        <div className="App">
            <h1>Hello World!</h1>
            <div id="df">
                <div>
                    <h3>Enter Description</h3>
                    <textarea id="description" cols="50" rows="15"></textarea>
                </div>
                <div>
                    <h3>Failed Tests</h3>
                    <textarea id="failed tests" cols="50" rows="15" readOnly></textarea>
                </div>
            </div>
            <div id="note">
                <h3>Notes</h3>
                <textarea id="notes" cols="100" rows="10"></textarea>
            </div>
            <br></br>
            <div id="buttons">
                <button id="save" type="button" onClick="sendRequest(true)">Save Question</button>
                <button id="submission" type="button" onClick={submit}>Submit Question</button>
            </div>
            <div id="test"></div>
        </div>
    );
    */
}

export default App