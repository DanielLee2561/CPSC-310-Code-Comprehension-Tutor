import './AttemptPage.css';
import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from "axios";

/*
    Props Required:
        - question_id (int): The ID of the question being viewed/attempted
        - attempt_num (int): The array position + 1 of the attempt being viewed/attempted (1-based indexing)
        - username (string): The user's username. Used to find and store attempt info
        - password (string): The user's password. Used for authentication purposes with the API calls.
 */

function AttemptPage() {
    // State
    const state = useLocation().state;
    const props = useLocation().state;

    const question_id = state.question;
    const attemptId = state.attempt;
    const username = state.username;
    const password = state.password;

  

    const numericAttemptId = parseInt(attemptId);
    // Initializing states and state hooks.
    const [functionText, setFunctionText] = useState("");

    const [isInProgress, setInProgress] = useState(true);
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [failingTestCases, setFailingTestCases] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    // const question_id = props.question_id;
    const [attemptNum, setAttemptNum] = useState(attemptId);
    const [testsCorrect, setTestsCorrect] = useState(0);
    const [testsTotal, setTestsTotal] = useState(0);
    const [duration, setDuration] = useState(0);

    // just for visual indicators that attempt is being saved/submitted
    // also useful to not bombard the server with many api calls from one user
    const [saveEnabled, setSaveEnabled] = useState(true);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [retryEnabled, setRetryEnabled] = useState(true);

    // IMPORTANT: This is not the full endpoint.
    // You may need to concatenate /attempts/:attempt_number (attemptNum) at the end.
    // Attempt number can change (due to retry/redo) so it cannot be statically included.
    const endpoint = "http://localhost:5000/users/" + username + "/questions/" + question_id;
    // For refreshing the page, use reloadPage()
    const navigate = useNavigate();
    const reloadPage = (newAttemptId) => {
        const update_state = {
            question: question_id,
            attempt: newAttemptId ? newAttemptId : attemptId,
            username: username,
            password: password
        };
        navigate(0, {state: update_state});
    };

    const textInstruction = "Explain the purpose of the following code.";
    const textDescription = "Input your description here";
    const textNotes = "Write your notes here (optional)";

    // State
    useEffect(() => {
        if (state === null) {
            navigate("/");
        } 
    }, [state])

    // get the corresponding data from the questionid and check user whether done this question before?
    // if not, create the new attempt; or return the latest attempt?

    useEffect(() => {
        const fetchData = async () => {
            try {
                // sessionStorage.setItem("attemptNumber", props.attempt_num);
                // setAttemptNum(attemptId);
                const response = await axios.put(endpoint + "/attempts/" + attemptId, {password: props.password});
                const result = response.data;

                setInProgress(result.inProgress);
                setDescription(result.description);
                setNotes(result.notes);
                setGeneratedCode(result.generatedCode);
                setFailingTestCases(result.failingTestCases);
                setTestsCorrect(result.testCorrect);
                setTestsTotal(result.testTotal);
                setDuration(result.duration);
                setFunctionText(result.question);
            } catch (err) {
                // For debugging
                console.log(err.message);
                // setFunctionText(err.message);
            }
        }
        fetchData();
    }, [state]);


    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    const handleSubmit = async () => {
        setSubmitEnabled(false);
        const input = {
            password: props.password,
            description: description,
            notes: notes,
            inProgress: false
        }

        try {
            await axios.put(endpoint, input);
        } catch (err) {
            console.log("ERROR: Could not send/fetch data (submit): " + err);
        } finally {
            setSubmitEnabled(true);
            reloadPage();
        }
    };

    const handleSave = async () => {
        setSaveEnabled(false);
        const input = {
            password: props.password,
            description: description,
            notes: notes,
            inProgress: true
        }
        try {
            await axios.put(endpoint, input);
        } catch (err) {
            console.log("ERROR: Could not send/fetch data (save): " + err);
        } finally {
            setSaveEnabled(true);
        }
    }

    const handleRetry = async () => {
        setRetryEnabled(false);
        const input = {
            password: password
        }
        try {
            const response = await axios.post(endpoint, input);
            const data = response.data;
          
            state.attempt = data.attemptNum;
            navigate("/attempt", {state: state});
        } catch (err) {
            console.log(attemptId);
           
        } finally {
            setRetryEnabled(true);
        }
    }

    // For return button
    const handleReturn = () => {
        delete state.question;
        delete state.attempt;
        navigate("/question_bank", {state: state});
    }

    const onHomeButtonClicked = () => {
        navigate("/home", {state: state});
    }

    const onProfileButtonClicked = () => {
        navigate("/profile", {state: state});
    }


    let scoreColour;
    if (testsCorrect / testsTotal === 1 || testsTotal === 0) {
        scoreColour = "mediumseagreen";
    } else if (testsCorrect / testsTotal > 1) {
        scoreColour = "blueviolet"; // This should likely never happen, just for debugging purposes (you can remove)
    } else if (testsCorrect / testsTotal > 0) {
        scoreColour = "orange";
    } else {
        scoreColour = "tomato";
    }

    return (
        <div className="AttemptPage">
            <div className="header">
                <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span
                    className='headerSpan'>Home</span></button>
                <button className="returnButton" title="Back" onClick={handleReturn}><span
                    className='headerSpan'>Return</span></button>
                <h1 className='headerTitleAttempt'>Question {question_id} (Attempt {attemptId})</h1>
                <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span
                    className='headerSpan'>Profile</span></button>
            </div>
            {!isInProgress ? <div>
                <h2 style={{color: scoreColour}}>{testsCorrect}/{testsTotal}&emsp;&emsp;{duration}s</h2>
            </div> : <h2 style={{color: "darkorchid"}}>Attempt In Progress</h2>}

            <h2>{textInstruction}</h2>

            <div className="grid-container">
                <pre className="grid-item function-text">
                    {functionText}
                </pre>

                {!isInProgress ? <pre className="grid-item function-text" style={{color: 'mediumslateblue'}}>
                    {generatedCode}
                </pre> : <pre className="grid-item" style={{textAlign: 'left', backgroundColor: "#f4f4f4"}}>
                    Submit to see your LLM generated code!
                </pre>}

                <textarea
                    className={`grid-item ${isInProgress ? "" : "readonly-textarea"}`}
                    style={{fontFamily: 'Helvetica', textAlign: 'left'}}
                    placeholder={textDescription}
                    onChange={handleDescription}
                    value={description}
                    readOnly={!isInProgress}
                />

                {isInProgress ? <pre className="grid-item readonly-textarea" id="failing-test-case-box"
                                     style={{fontFamily: 'Arial, sans-serif', textAlign: 'left'}}>
                    Submit to see if you have any failing test cases
                </pre> : <pre className="grid-item readonly-textarea" id="failing-test-case-box"
                              style={{fontFamily: 'Arial, sans-serif', textAlign: 'left', color: 'red'}}>
                    {failingTestCases}
                </pre>}

                <textarea
                    className={`grid-item ${isInProgress ? "" : "readonly-textarea"}`}
                    style={{textAlign: 'left'}}
                    placeholder={textNotes}
                    onChange={handleNotes}
                    value={notes}
                    readOnly={!isInProgress}
                />
            </div>

            <h2></h2> {/* Just for some separation between the question side and the save/submitting stuff*/}

            {isInProgress ? <div>
                {saveEnabled ? <button className="active-button" onClick={handleSave}>Save</button> :
                    <button className="inactive-button" disabled>Saving...</button>}
                {submitEnabled ? <button className="active-button" onClick={handleSubmit}>Submit</button> :
                    <button className="inactive-button" disabled>Submitting...</button>}
            </div> : <div>
                {retryEnabled ? <button className="active-button" onClick={handleRetry}>Retry</button> :
                    <button className="inactive-button" disabled>Initializing new attempt...</button>}
            </div>}

            {isInProgress && <h5>Please allow some time for submission, generating code can take a while.</h5>}
        </div>
    );
}

export default AttemptPage;
