import React from 'react'
import { useNavigate } from 'react-router-dom'

import './question_page.css'


const Question = () => {

    const storage = (not_finished) => {
        let description = document.getElementById("descriptions");
        let note = document.getElementById("notes");
        description.textContent = "";
    };

    return (
        <div className="App">
        <h1>Hello World!</h1>
        <div id="df">
            <div>
                <h3>Enter Description</h3>
                <textarea id="descriptions" cols="50" rows="15"></textarea>
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
            <button id="save" type="button" onClick={() => storage(true)}>Save Question</button>
            <button id="submission" type="button" onClick={() => storage(false)}>Submit Question</button>
        </div>
        <div id="test"></div>
    </div>
    );
}


export default Question