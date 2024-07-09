import React, { useEffect,useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import './questions.css'
import axios from 'axios';



const QuestionItem = ({ question, attempts }) => {
  const { questionId } = question;
  const [expanded, setExpanded] = useState(false);
  const userInfo = useLocation().state;
  
  const navigate = useNavigate();
  
  const onClickView=()=>{

  }

  const onClickRedo=()=>{
    
  }

  const onClickExpand = () => {
    setExpanded(!expanded);
  };

  const Attempt = (id) => {
    return (
      <li>
        Attempt {id} [DATE] [SCORE] [TIME]
        <button onClick={() => navigate("/attempt")}>View</button>
      </li>
    )
  }

  return (
    <li key={questionId}>
      <div className="question-header">
        <input
          className={expanded ? "arrow down" : "arrow right"}
          type="button"
          onClick={onClickExpand}
        />
        <span className="question-title">
          Question {questionId} [DATE] [SCORE] [TIME]
        </span>
        <button className="start-button" onClick={() => navigate('/attempt', {state: userInfo})}>
          Start
        </button>
      </div>
      {expanded && (
        // <ul>
        //   {attempts.map((attempt) => (
        //     <Attempt key={attempt.id} id={attempt.id} />
        //   ))}
        // </ul>
        <ul>
          <li><span>Question [1] [DATE] [SCORE] [TIME]</span>
              <button>View</button> 
              <button>Redo</button>
          </li>
          <li><span>Question [2] [DATE] [SCORE] [TIME]</span>
              <button>View</button>
              <button>Redo</button>
          </li>
        </ul>
      )}
    </li>
  );
};

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const userInfo = useLocation().state;

  const onHomeButtonClicked = () => {
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    navigate("/profile", {state: userInfo});
  }

  useEffect(() => {
    if (userInfo === null) {
      navigate("/")
    } 
  })


  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/questions");
        setQuestions(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    getQuestions();
  }, []);

  return (
    <div>
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Homw</span></button>
        <h1 className='headerTitle'>Questions</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.questionId}
            question={question}
          />
        ))}
      </ul>
    </div>
  );
}

export default QuestionPage;