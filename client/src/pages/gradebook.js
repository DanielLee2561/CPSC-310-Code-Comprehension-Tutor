import React, { useEffect,useState } from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom'
import './header.css'
import './gradebook.css'

const Gradebook = (props) => {
  const [data, setData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate()
  const userInfo = useLocation().state;
  const [averageScores, setAverageScores] = useState([0]);

  const onHomeButtonClicked = () => {
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    navigate("/profile", {state: userInfo});
  }

  const getGrades = async () => {
    try {
        const res = await axios.put("http://localhost:5000/questions/gradebook/gradebook_data", {
          username: "Researcher_A",
          password: "pResearcher_A"
        });
        setData(res.data.users);
      } catch (err) {
        console.log(err.response.data.message);
      } 
  }

  const getQuestions = async () => {
    try {
        const res = await axios.get("http://localhost:5000/questions/");
        setQuestions(res.data);
      } catch (err) {
        console.log(err);
      } 
  }

  const getAverageScore = (scores) => {
    if ((scores.length - 1) !== 0) {
      return Math.round(10 * scores.reduce((x,y) => (x+y))/(scores.length - 1))/10 + "%";
    } else {
      return "N/A";
    }
  }

  const questionAverages = (ques) => {
    let totalScore = 0;
    let totalStudents = 0;
    for (let i = 0; i < data.length; i++) {
      let questions = data[i].questions;
      let question = questions.find((q) => (q.questionId === ques.id));
      if (question !== undefined) {
        if (question.testCorrect !== -1) {
          console.log(question)
          totalScore += (question.testCorrect/question.testTotal) * 100;
          totalStudents++;
        }
      }
    }
    if (totalStudents === 0) {
      return "N/A";
    }
    const result = Math.round(10 * totalScore/totalStudents)/10;
    averageScores.push(result);
    return result + "%";
  }

  const studentAverage = (student) => {
    let totalScore = 0
    let numCompletedQuestions = 0;
    const questions = student.questions;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].testCorrect !== -1) {
        totalScore += 100 * (questions[i].testCorrect/questions[i].testTotal);
        numCompletedQuestions++;
      }
    }
    if (numCompletedQuestions === 0) {
      return "N/A";
    }
    return (Math.round(10 * totalScore/numCompletedQuestions))/10 + "%";
  }

  useEffect(() => {
    if (userInfo === null) {
    //   navigate("/")
    } 
    getGrades();
    getQuestions()
  }, [])

  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>Gradebook</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <table>
        <tr>
          <th>Students</th>
          {console.log(questions)}
          {questions.map((ques) => {
            return <th>Question #{ques.id}</th>
          })}
          <th>Student Averages</th>
        </tr>
        {console.log(data)}
        {data.map((stu) => {
          return <tr>
                  <td>{stu.username}</td>
                  {stu.questions.map((ques) => {
                    if (ques.testCorrect === -1) {
                      return <td>N/A</td>
                    } else {
                      return <td>{Math.round(10 * 100 * (ques.testCorrect/ques.testTotal))/10}%</td>
                    }
                  })}
                  <td>{studentAverage(stu)}</td>
                </tr>
        })}
        <tr>
        <td>Question Averages</td>
        {questions.map((ques) => {
          return <td>
                    {questionAverages(ques)}
                  </td>
        })}
        {console.log(averageScores)}
        <td>{getAverageScore(averageScores)}</td>
        </tr>
      </table>
    </div>
  )
}

export default Gradebook