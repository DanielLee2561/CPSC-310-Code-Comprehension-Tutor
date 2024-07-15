import './AttemptPage.css';
import { useParams } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

/*
    Props Required:
        - question_id (int): The ID of the question being viewed/attempted
        - attempt_num (int): The array position + 1 of the attempt being viewed/attempted (1-based indexing)
        - username (string): The user's username. Used to find and store attempt info
        - password (string): The user's password. Used for authentication purposes with the API calls.
 */

function AttemptPage(props) {
    const { id: question_id,attemptId:attemptId} = useParams();
    const username="Student_A";
    const numericAttemptId = parseInt(attemptId);
    const [functionText, setFunctionText] = useState(""); 
    const [isInProgress, setInProgress] = useState(true);
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [failingTestCases, setFailingTestCases] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [attemptNum, setAttemptNum] = useState("");
    const [testsCorrect, setTestsCorrect] = useState(0);
    const [testsTotal, setTestsTotal] = useState(0);
    const [duration, setDuration] = useState(0);

    const [saveEnabled, setSaveEnabled] = useState(true);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [retryEnabled, setRetryEnabled] = useState(true);

    
    // For refreshing the page, use reloadPage()
    const navigate = useNavigate();
    const reloadPage = () => {
        navigate('/questions'); 
    };

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const questionsResponse  = await axios.get(`http://localhost:5000/questions/${question_id}`);
                const userResponse  = await axios.get(`http://localhost:5000/users/${username}`) ;
                const questions = questionsResponse.data;
                console.log("questions"+questions);
                const user = userResponse.data;
                console.log(user);
                const userQuestion = user.questions.find(q => q.questionId === parseInt(question_id));
                console.log(userQuestion); 
                setFunctionText(questions.code); 
                const attmeptNum=attemptId;
                setAttemptNum(attmeptNum);
                console.log(attmeptNum);
                if (userQuestion) {
                    if (userQuestion.attempts && userQuestion.attempts.length > attmeptNum && attmeptNum >= 0) {
                        setDescription(userQuestion.attempts[attmeptNum]?.description || '');
                        setNotes(userQuestion.attempts[attmeptNum]?.notes || '');
                        setGeneratedCode(userQuestion.attempts[attmeptNum]?.generatedCode || '');
                        setFailingTestCases(userQuestion.attempts[attmeptNum]?.failingTestCases || []);          
                } 
            }
        }
            catch (error) {
                console.error('Error fetching question:', error);
            }
        };
    
        fetchQuestionData(); 
    
    }, [question_id,username]); 



    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    const submit = async (description, notes) => {
        console.log('Submit function called with:', description, notes); // Debugging line
    
        setSubmitEnabled(false);
    
        try {
            // Call the backend to generate code
            const generatedCodeResponse = await axios.get('http://localhost:5000/questions/ollama/submit', {
                params: {
                    description: description,
                    notes: notes
                }
            });
    
            // Extract generated code from response

            const generatedCode = generatedCodeResponse.data;
            
            // const generatedCodejsonString = JSON.stringify(jsonObject, null, 2);
            // console.log(generatedCode);

     
            const extractFunctionContent = (str) => {
                const regex = /```javascript\s*([\s\S]*?)\s*```/;
                const match = str.match(regex);
                if (match && match[1]) {
                return match[1].trim();
                }
                return null;
            };
            const extractedFunction = extractFunctionContent(generatedCode);
            setGeneratedCode(extractedFunction);
            console.log(extractedFunction);
            
            const input = {
                password: 'pStudent_A',
                description: description,
                generatedCode: extractedFunction,
                notes: notes,
                inProgress: false
            };
            const attemptIndex = parseInt(attemptId) + 1;
            const response = await axios.put(`http://localhost:5000/users/${username}/questions/${question_id}/${attemptIndex}`, input);
            console.log(response);
            // call other files and and response to there

            // pass the generated code into the test part 

        } catch (err) {
            console.log('There was a problem submitting the attempt: ' + err);
        } finally {
            setSubmitEnabled(true);
        }
    };


    const handleSubmit = () => {
        submit(description, notes);

    };

   
    const save = async () => {
        //  setSaveEnabled(false);
        const input = {
            password:'pStudent_A',
            description: description,
            generatedCode:generatedCode,
            notes: notes,
            inProgress: true
        };
        console.log("submit description"+description);
        try {
            const attemptIndex=parseInt(attemptId)+1;
            const response = await axios.put(`http://localhost:5000/users/${username}/questions/${question_id}/${attemptIndex}`, input);
            console.log(response.data);
            console.log('Data saved successfully:', response.data);
             reloadPage();
        } catch (error) {
            console.error('There was a problem saving the attempt:', error);
        } finally {
            setSaveEnabled(true);
        }
    };

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

    return (
        <div className="AttemptPage">
            <h1 style={{ color: "black" }}>Question: {question_id} - Attempt # {numericAttemptId+1}</h1>
            <button className="return-button" onClick={handleReturn}>Return</button>
            {!isInProgress ? <div>
                <h2 style={{ color: scoreColour }}>{testsCorrect}/{testsTotal}&emsp;&emsp;{duration}s</h2>
            </div> : <h2 style={{ color: "darkorchid" }}>Attempt In Progress</h2>}

            <h2>Formulate the functionality of the following function</h2>

            <div className="grid-container">
                <pre className="grid-item function-text">
                    {functionText}
                </pre>

                {!isInProgress ? <pre className="grid-item function-text" style={{ color: 'mediumslateblue' }}>
                    {generatedCode}
                </pre> : <pre className="grid-item" style={{ textAlign: 'left', backgroundColor: "#f4f4f4" }}>
                    {generatedCode}
                </pre>}

                <textarea
                    className={`grid-item ${isInProgress ? "" : "readonly-textarea"}`}
                    style={{ fontFamily: 'Helvetica', textAlign: 'left' }}
                    placeholder="Input your description here..."
                    onChange={handleDescription}
                    value={description}
                    readOnly={!isInProgress}
                />

                {isInProgress ? <pre className="grid-item" id="failing-test-case-box" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
                    Submit to see if you have any failing test cases
                </pre> : <pre className="grid-item" id="failing-test-case-box" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'left', color: 'red' }}>
                    {failingTestCases}
                </pre>}

                <textarea
                    className={`grid-item ${isInProgress ? "" : "readonly-textarea"}`}
                    style={{ textAlign: 'left' }}
                    placeholder="Write notes here (optional)"
                    onChange={handleNotes}
                    value={notes}
                    readOnly={!isInProgress}
                />
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
        </div>
    );
}

export default AttemptPage;