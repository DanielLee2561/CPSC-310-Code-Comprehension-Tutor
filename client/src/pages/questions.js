import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

    return (
      <li key={index}>
        <span>
          Attempt {index + 1} [date] [score] [time]
        </span>
        <button onClick={() => navigate(`/questions/${id}/${index}`)}>View</button>
      </li>
    );
  };

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
        <button className="start-button" onClick={() => navigate(`/questions/${id}/attmept`)}>
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
      <h2>Questions</h2>
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
