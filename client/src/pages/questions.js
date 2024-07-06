import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './questions.css'
import axios from 'axios';



const QuestionItem = ({ question, attempts }) => {
  const { questionId } = question;
  const [expanded, setExpanded] = useState(false);
  
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
        <button className="start-button" onClick={() => navigate('/attempt')}>
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
      <h2>Questions</h2>
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