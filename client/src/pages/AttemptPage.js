import './AttemptPage.css';
import {useState} from 'react';

// Props contain questionID (id), question function(question), the attempt number (attempt_num) and user's password (password)
function AttemptPage(props) {
    const [error, setError] = useState("");
    const [isInProgress, setInProgress] = useState(true);
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [failingTestCases, setFailingTestCases] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    const question_id = props.id; //
    const [attemptNum, setAttemptNum] = useState(props.attempt_num);
    const [testsCorrect, setTestsCorrect] = useState(0);
    const [testsTotal, setTestsTotal] = useState(0);

    const functionText = props.question;
    // const generatedFunctionText = `function foo() {\nconst message = "Hello, world!";\nconsole.log(message);\n}`

    // just for visual indicators that attempt is being saved/submitted
    // also useful to not bombard the server with many api calls from one user
    const [saveEnabled, setSaveEnabled] = useState(true);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [retryEnabled, setRetryEnabled] = useState(true);

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    const handleSubmit = async () => {
        setError("");
        setSubmitEnabled(false);
        if (!description) {
            setError("ERROR: Please write the english description of the function");
            setSubmitEnabled(true);
            return;
        }

        const data = {
            password: props.password, 
            description: description, 
            notes: notes, 
            inProgress: false
        };

        // TODO: api submit call here
        const submitSuccessful = true; // stub

        setTimeout(() => {
            if (submitSuccessful) {
                setDescription("");
                setNotes("");
                setGeneratedCode(`function foo() {\nconst message = "Hello, world!";\nconsole.log(message);\n}`); 
                setFailingTestCases("Get the failing test cases from the 'submit' api call");
                setTestsCorrect(Math.round(Math.random() * 4)); 
                setTestsTotal(4); 

                setInProgress(false);
            } else {
                alert("Attempt submission was not successful. Please try again later");
            }
            setSubmitEnabled(true);
        }, 1000);
    }

    const handleSave = () => {
        setSaveEnabled(false);

        const data = {
            password: props.password, description: description, notes: notes, inProgress: true
        }
        // TODO: api save call here
        const saveSuccessful = true; // stub


        // Makes button disabled for 1 sec  & displays a short message to indicate
        // that attempt saving was successful or not
        //  - When API call is implemented, remove the setTimeout() function (keep the stuff in it though)
        //    This simulates what saving could look like to the user
        setTimeout(() => {
            if (saveSuccessful) {
                alert("Attempt saved successfully!");
            } else {
                alert("Attempt could not be saved. Please try again later");
            }
            setSaveEnabled(true);
        }, 1000);

    }

    const handleRetry = () => {
        setRetryEnabled(false);
        const data = {
            password: props.password
        }
        // TODO: api start attempt call here
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
            <h1 style={{ color: "black" }}>Question: {question_id} - Attempt: #{attemptNum}</h1>

            {!isInProgress ? <h2 style={{ color: scoreColour }}>Score: {testsCorrect}/{testsTotal}</h2> :
                <h2 style={{ color: "darkorchid" }}>Attempt In Progress</h2>}

            <h2>Formulate the functionality of the following foo function</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid-container">
                    <pre className="grid-item function-text">
                        {functionText}
                    </pre>

                    {!isInProgress ? <pre className="grid-item function-text" style={{ color: 'mediumslateblue' }}>
                        {generatedCode}
                    </pre> : <pre className="grid-item" style={{ textAlign: 'left', backgroundColor: "#f4f4f4" }}>
                        Submit to see your LLM generated code!
                    </pre>}

                    {isInProgress ? <textarea
                        className="grid-item"
                        style={{ fontFamily: 'Helvetica', textAlign: 'left' }}
                        placeholder="Input your description here..."
                        onChange={handleDescription}
                    /> : <textarea
                        className="grid-item readonly-textarea"
                        style={{ fontFamily: 'Helvetica', textAlign: 'left' }}
                        value={description}
                        readOnly
                    />}
                    {isInProgress && error && <div className="error" style={{ color: "red" }}>{error}</div>}

                    {isInProgress ? <pre className="grid-item" id="failing-test-case-box"
                        style={{ fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
                        Submit to see if you have any failing test cases
                    </pre> : <pre className="grid-item" id="failing-test-case-box"
                        style={{ fontFamily: 'Arial, sans-serif', textAlign: 'left', color: 'red' }}>
                        {failingTestCases}
                    </pre>}

                    {isInProgress ? <textarea
                        className="grid-item"
                        style={{ textAlign: 'left' }}
                        placeholder="Write notes here (optional)"
                        onChange={handleNotes}
                    /> : <textarea
                        className="grid-item readonly-textarea"
                        style={{ textAlign: 'left' }}
                        value={notes}
                        readOnly
                    />}
                </div>

                <h2></h2>

                {isInProgress ? <div>
                    {saveEnabled ? <button type="button" onClick={handleSave}>Save</button> : <button type="button" disabled>Saving...</button>}
                    {submitEnabled ? <button type="submit">Submit</button> : <button type="button" disabled>Submitting...</button>}
                </div> : <div>
                    {retryEnabled ? <button type="button" onClick={handleRetry}>Retry</button> :
                        <button type="button" disabled>Initializing new attempt...</button>}
                </div>}

                {isInProgress && <h5>Please allow some time for submission, generating code can take a while.</h5>}
            </form>
        </div>
    );
}

export default AttemptPage;