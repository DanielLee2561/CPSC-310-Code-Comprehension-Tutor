import React, { useEffect,useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import './questions.css'
import axios from 'axios';



const QuestionItem = ({ question, attempt }) => {
  const { id } = question;
  const {attempts}=attempt;
  
  const [expanded, setExpanded] = useState(false);
  
  const navigate = useNavigate();
  

  const onClickRedo=()=>{
    
  }

  const onClickExpand = () => {
    setExpanded(!expanded);
  };

  const Attempt = ({ attempt, index }) => {
    const { date, score, time } = attempt;
    const userInfo = useLocation().state;

    return (
      <li key={index}>
        <span>
          Attempt {index + 1} [date] [score] [time]
        </span>
        <button onClick={() => navigate(`/questions/${id}/${index}`, {state: userInfo})}>View</button>
      </li>
    );
  };

  const userInfo = useLocation().state;
  return (
    <li key={id}>
      <div className="question-header">
        <input
          className={expanded ? "arrow down" : "arrow right"}
          type="button"
          onClick={onClickExpand}
        />
        <span className="question-title">
          Question {id} 
        </span>
        <button className="start-button" onClick={() => navigate(`/questions/${id}/attmept`, {state: userInfo})}>
          Start
        </button>
      </div>
      {expanded && (
        <ul>
          {attempts.map((attempt, index) => (
            <Attempt key={index} attempt={attempt} index={index} />
          ))}
        </ul>
      )}
    </li>
  );
};


function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [attempts,setAttempts]=useState([]);
  const username = "Student_A";  // need to change dynamically 
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
      navigate("/");
    } 
  })


  useEffect(() => {
    const getQuestions = async () => {
      try {
        const questionsResponse = await axios.get("http://localhost:5000/questions");
        const userResponse = await axios.get(`http://localhost:5000/users/${username}`);
        setQuestions(questionsResponse.data);
        setAttempts(userResponse.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    getQuestions();
  }, [username]);
  
  return (
    <div>
        <div className="header">
          <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
          <h1 className='headerTitle'>Questions</h1>
          <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
        </div>
      <ul>
        {questions.map((question) => {
          const attempt=attempts.find(a=>a.questionId===question.id);
         return (
            <QuestionItem
            key={question.id}
            question={question}
            attempt={attempt || { attempts: [] }}
            />
          );
        })}
      </ul>
    </div>
  )
}

export default QuestionPage;
