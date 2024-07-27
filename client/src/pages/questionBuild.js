import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import './questionBuild.css';

function QuestionsBuild() {
    const state = useLocation().state;
    const navigate = useNavigate();
    const [inputAreas, setInputAreas] = useState([]);
    const [question, setQuestion] = useState("");
    const [questionCode, setQuestionCode] = useState("");
    const [questionId, setQuestionId] = useState(0);
    const [failedTests,setFailedTests]=useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 

    useEffect(() => {
        if (!state) {
            navigate("/");
        }
    }, [state, navigate]);

    useEffect(() => {
        if (state) {
            const initialize = async () => {
                try {
                    const { username, password, question: id } = state;
                    let response = await axios.put(`http://localhost:5000/questions/${username}/researcher/questions/${id}`, {
                        password,
                        id
                    });
                    let questionData = response.data;
                    setQuestion(questionData);
                    setQuestionCode(questionData.code);
                    setQuestionId(questionData.id);
                    setInputAreas(questionData.tests);
                } catch (error) {
                    console.error('View Questions', error);
                }
            };
            initialize();
        }
    }, [state]);

    const onHomeButtonClicked = () => {
        navigate("/home", { state: state });
    };

    const handleReturn = () => {
        navigate("/question_management", { state: state });
    };

    const onProfileButtonClicked = () => {
        navigate("/profile", { state: state });
    };

    const handleInputChange = (index, field, value) => {
        const newInputAreas = [...inputAreas];
        newInputAreas[index][field] = value;
        setInputAreas(newInputAreas);
    };

    const handleDelete = (index) => {
        const newInputAreas = inputAreas.filter((_, i) => i !== index);
        setInputAreas(newInputAreas);
    };

    const handleDeleteQuestion = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this question?");
        if (confirmed) {
            try {
                const { username, password, question: id } = state;
                await axios.delete(`http://localhost:5000/questions/${username}/researcher`, {
                    data: {
                        password,
                        id
                    }
                });
                navigate("/question_management", {state: state});
            } catch (error) {
                console.error('Delete Question', error);
            }
        }
    };

    const handleQuestionCodeChange = (e) => {
        setQuestionCode(e.target.value);
    };

    const handleAddTest = () => {
        setInputAreas([...inputAreas, { title: 'title', assertion: 'assertion' }]);
    };

    const handleSaveQuestion = async () => {
        try {
            const { username, password, question: id } = state;
            const response=await axios.put(`http://localhost:5000/questions/${username}/researcher/question/${id}`, {
                username,
                password,
                id,
                code: questionCode,
                tests: inputAreas
            });
            const failed=response.data.details;
            if (typeof failed === 'undefined') {
                setShowError(false);
                window.location.reload();
            } else if (!Array.isArray(failed)) {
                setShowError(true);
                setErrorMessage('The function is not valid.');
            } else {
                setFailedTests(failed);
                if (failed.length > 0) {
                    setShowError(true);
                    setErrorMessage(response.data.error);
                } else {
                    setShowError(false);
                    window.location.reload();
                }
            }     
        } catch (error) {
            console.error('Save Question', error);
            setShowError(true);
            setErrorMessage("code or tests are empty");
        }
    };

    return (
        <div className="questionBuild">
            <div className="headerBuild">
                <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}>
                    <span className='headerSpan'>Home</span>
                </button>
                <button title="Go Back" className='returnButton' onClick={handleReturn}>
                    <span className='headerSpan'>Return</span>
                </button>
                <h1 className='headerTitleBuild'>Question Builder</h1>
                <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}>
                    <span className='headerSpan'>Profile</span>
                </button>
            </div>
            <h1 className='questionNumber'>Question # {questionId}</h1>
            <div className='questionContent'>
                <textarea
                    className="gridItem"
                    style={{ textAlign: 'left' }}
                    value={questionCode}
                    onChange={handleQuestionCodeChange}
                />
            </div>
            <div className='inputArea'>
                {inputAreas.map((inputArea, index) => {
                    const isFailed = failedTests.some(failedTest => failedTest.assertion === inputArea.assertion); 
                    return (
                        <div key={index} className='questionInputBox' style={{ backgroundColor: isFailed ? '#ff9999' : '#d4f4dd' }}
                        >
                            <div className="testLabel">Test</div>
                            <div className='titleAndText'>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={inputArea.title}
                                    onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Assertion"
                                    value={inputArea.assertion}
                                    onChange={(e) => handleInputChange(index, 'assertion', e.target.value)}
                                />
                            </div>
                            <button className="deleteTestButton" onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    );
                })}
            </div>
            {showError && (
                <div className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
                   {"Save Question failed :" + errorMessage}
                </div>
            )}
            <div className='actions'>
                <button className="deleteQuestion" onClick={handleDeleteQuestion}>Delete Question</button>
                <button className="addTest" onClick={handleAddTest}>Add Test</button>
                <button className="saveQuestion" onClick={handleSaveQuestion}>Save Question</button>
            </div>
        </div>
    );
}

export default QuestionsBuild;
