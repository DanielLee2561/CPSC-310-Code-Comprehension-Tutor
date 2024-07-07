import './AttemptPage.css';
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

/*
    Props Required:
        - question_id (int): The ID of the question being viewed/attempted
        - attempt_num (int): The array position + 1 of the attempt being viewed/attempted (1-based indexing)
        - username (string): The user's username. Used to find and store attempt info
        - password (string): The user's password. Used for authentication purposes with the API calls.
 */
function AttemptPage(props) {
    // Initializing states and state hooks.
    const [functionText, setFunctionText] = useState("");

    const [isInProgress, setInProgress] = useState(true);
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [failingTestCases, setFailingTestCases] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    const question_id = props.question_id;
    const [attemptNum, setAttemptNum] = useState(props.attempt_num);
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
    const endpoint = "/users/" + props.username + "/questions/" + props.question_id;
    // For refreshing the page, use reloadPage()
    const navigate = useNavigate();
    const reloadPage = () => {
        navigate(0);
    };

    // Set up all the variables based on saved attempt data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: BUG here. 500 internal server error.
                const response = await fetch(endpoint + "/attempts/" + attemptNum, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    console.log(response);
                    // TODO: Fix here. Refresh the page if the response is not ok.
                    //  very hacky and could potentially lead to an infinite loop.
                    reloadPage();
                }
                const result = await response.json();

                setInProgress(result.inProgress);
                setDescription(result.description);
                setNotes(result.notes);
                setGeneratedCode(result.generatedCode);
                setFailingTestCases(result.failingTestCases);
                setTestsCorrect(result.testCorrect);
                setTestsTotal(result.testTotal);
                setDuration(result.duration);

                // TODO: Get question's function from the get attempt stuff.
                setFunctionText("Thing");
            } catch (err) {
                // For debugging
                console.log(err.message);
                setFunctionText(err.message);
            }
        }
        fetchData();
    }, [endpoint, attemptNum, reloadPage]);


    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    const submit = async () => {
        setSubmitEnabled(false);
        const input = {
            password: props.password,
            description: description,
            notes: notes,
            inProgress: false
        }
        try {
            const response = await fetch(endpoint, {
                method: "PUT", headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(input)
            });

            if (!response.ok) {
                console.log("Could not fetch data. Code " + response.status);
            } else {
                reloadPage();
            }
        } catch (err) {
            console.log("There was a problem submitting the attempt: " + err);
        } finally {
            setSubmitEnabled(true);
        }
    }

    const handleSubmit = () => {
        submit();
    };

    const save = async () => {
        setSaveEnabled(false);
        const input = {
            password: props.password, description: description, notes: notes, inProgress: true
        }
        try {
            const response = await fetch(endpoint, {
                method: "PUT", headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(input)
            });

            if (!response.ok) {
                console.log("Could not fetch data. Code " + response.status);
            } else {
                reloadPage();
            }
        } catch (err) {
            console.log("There was a problem saving the attempt: " + err);
        } finally {
            setSaveEnabled(true);
        }
    }

    const handleSave = () => {
        save();
    }

    const retry = () => {
        setRetryEnabled(false);
        const input = {
            password: props.password
        }
        // TODO: Retry may look similar to this (no guarantees though!)
        // try {
        //     const response = await fetch(endpoint, {
        //         method: "PUT",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(input)
        //     });
        //
        //     if (!response.ok) {
        //         console.log("Could not fetch data. Code " + response.status);
        //     } else {
        //         reloadPage();
        //     }
        // } catch (err) {
        //     console.log("There was a problem saving the attempt: " + err);
        // } finally {
        //     setSaveEnabled(true);
        // }

        // TODO: Delete below stuff when retry is actually created
        const retrySuccessful = true; // stub

        setTimeout(() => {
            if (retrySuccessful) {
                setAttemptNum(attemptNum + 1); // change this to be the new attempt number
                // its not always +1 (ie user is on attempt 3 page and wants to retry, but they already did attempt 4)
                // potentially also restate the function question as well (for same reason as above)
                setInProgress(true); //
                setGeneratedCode("");
                setFailingTestCases("");
            } else {
                alert("Initializing new attempt failed."); // question may no longer exist?
            }
            setRetryEnabled(true);
        }, 1000);
    }

    const handleRetry = () => {
        retry();
    }

    // For return button
    const handleReturn = () => {
        navigate("/questions");
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

    return (<div className="AttemptPage">
        <h1 style={{color: "black",}}>Question: {question_id} - Attempt: #{attemptNum}</h1>
        <button className="return-button" onClick={handleReturn}>Return</button>
        {!isInProgress ? <div>
            <h2 style={{color: scoreColour}}>{testsCorrect}/{testsTotal}&emsp;&emsp;{duration}s</h2>
        </div> : <h2 style={{color: "darkorchid"}}>Attempt In Progress</h2>}

        <h2>Formulate the functionality of the following foo function</h2>

        <div className="grid-container">
        <pre className="grid-item function-text">
            {functionText}
        </pre>

            {!isInProgress ? <pre className="grid-item function-text" style={{color: 'mediumslateblue'}}>
              {generatedCode}
          </pre> : <pre className="grid-item" style={{textAlign: 'left', backgroundColor: "#f4f4f4"}}>
            Submit to see your LLM generated code!
          </pre>}

            {isInProgress ? <textarea
                className="grid-item"
                style={{fontFamily: 'Helvetica', textAlign: 'left'}}
                placeholder="Input your description here..."
                onChange={handleDescription}
            /> : <textarea
                onChange={handleDescription}
                className="grid-item readonly-textarea"
                style={{fontFamily: 'Helvetica', textAlign: 'left'}}
                value={description}
                readOnly
            />}

            {isInProgress ? <pre className="grid-item" id="failing-test-case-box"
                                 style={{fontFamily: 'Arial, sans-serif', textAlign: 'left'}}>
            Submit to see if you have any failing test cases
            </pre> : <pre className="grid-item" id="failing-test-case-box"
                          style={{fontFamily: 'Arial, sans-serif', textAlign: 'left', color: 'red'}}>
            {failingTestCases}
            </pre>}

            {isInProgress ? <textarea
                className="grid-item"
                style={{textAlign: 'left'}}
                placeholder="Write notes here (optional)"
                onChange={handleNotes}
            /> : <textarea onChange={handleNotes}
                           className="grid-item readonly-textarea"
                           style={{textAlign: 'left'}}
                           value={notes}
                           readOnly
            />}
        </div>

        <h2> </h2> {/* Just for some separation between the question side and the save/submitting stuff*/}

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

    </div>);
}

export default AttemptPage;