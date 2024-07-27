// REFERENCE: https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
// https://stackoverflow.com/questions/71500670/uselocation-hook-keeps-states-even-on-hard-refresh

import React, { Component, useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import './header.css'
import './profile.css'

import aplus from '../icons/stickers/A+.png'

const Profile = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()
  const userInfo = useLocation().state;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [researcher, setResearcher] = useState(false);

  // get grade on profile
  const [questions, setQuestions] = useState([]);
  const [grades, setGrade] = useState([]);
  const [average, setAverage] = useState(0);

  const isResearcher = async () => {
    await axios.get("http://localhost:5000/users/research/researcher", {
      params: {
        username: userInfo.username,
        password: userInfo.password
      }
    }).then(data => {
      if (data.status === 200) { 
        setResearcher(true);
      } else {
        setResearcher(false);
      }
    }).catch(err => console.log(err.response.data.message));
  }

  useEffect(() => {
    if (userInfo === null) {
      navigate("/");
    } else {
      isResearcher();
      //getQuestions();
      getGrades();
    }
  })

  const onHomeButtonClicked = () => {
    console.log(userInfo);
    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {
    console.log(userInfo);
    navigate("/profile", {state: userInfo});
  }

  const onLogoutButtonClicked = async () => {
    const username = userInfo.username;
    await axios.put("http://localhost:5000/users/logout", {
      username
    });
    window.history.replaceState({}, '');
    navigate("/", {
      state: null
    });
  }

  const onDeleteButtonClicked = async () => {
    const username = userInfo.username;
    await axios.delete("http://localhost:5000/users/" + userInfo.username, {
      password: userInfo.password
    });
    alert("Your account has been deleted")
    window.history.replaceState({}, '');
    navigate("/", {
      state: null
    });
  }

  const onButtonClick = async () => {
    if (oldPassword === "") {
      setError("ERROR: Input your old password");
      return;
    }

    if ((newPassword === "") || (newPassword.length < 5)) {
      setError("ERROR: Input a new password with at least 5 characters");
      return;
    }

    if ((confirmNewPassword === "") || (confirmNewPassword.length < 5)) {
      setError("ERROR: Confirm your new password");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("ERROR: Passwords do not match");
      return;
    }

    let valid = false;

    try {
      const res = await axios.put('http://localhost:5000/users/' + userInfo.username, {
        oldPassword,
        newPassword
      });
      
      valid = res.status === 204 ? true : false;
    } catch (err) {
      setError(err.response.data.message);
    } 
    if (valid) {
      alert("Your password has been reset");
      window.history.replaceState({}, '');
      navigate("/home", {
        state: null
      });
      return;
    } else {
      setError("ERROR: Old password is incorrect");
      return;
    }
  }

  /*
  const getQuestions = async () => {
    try {
        const res = await axios.get("http://localhost:5000/questions/");
        setQuestions(res.data);
      } catch (err) {
        console.log(err);
      } 
  }
  */

  // placeholder, need new api
  const getGrades = async () => {
    try {
      const res = await axios.put("http://localhost:5000/users/" + userInfo.username + "/grade", {
        username: userInfo.username,
        password: userInfo.password
      })
      /*
      const res = await axios.put("http://localhost:5000/questions/gradebook/gradebook_data", {
        username: "Researcher_A",
        password: "pResearcher_A"
      });
      */
      setGrade(res.data.grade);
    } catch (err) {
      console.log(err);
    }
  };

  const getAverageScore = (grades) => {
    let totalScore = 0
    let numCompletedQuestions = 0;
    for (let i = 0; i < grades.length; i++) {
      if (grades[i].testCorrect !== -1) {
        totalScore += 100 * (grades[i].testCorrect/grades[i].testTotal);
        numCompletedQuestions++;
      }
    }
    if (numCompletedQuestions === 0) {
      return "N/A";
    }
    return (Math.round(10 * totalScore/numCompletedQuestions))/10;
  };

  const renderGradeHeader = (grades) => {grades.map((ques) => {return <th>Question #{ques.questionId}</th>})};

  const renderSticker = (score, side) => {
    if (score >= 90) {
      return <td><img className='stickers' src={aplus} alt='A+' width={side} height={side}/></td>
    } else if (score >= 85) {
      return <td>A</td>
    } else if (score >= 80) {
      return <td>A-</td>
    } else if (score >= 76) {
      return <td>B+</td>
    } else if (score >= 72) {
      return <td>B</td>
    } else if (score >= 68) {
      return <td>B-</td>
    } else if (score >= 64) {
      return <td>C+</td>
    } else if (score >= 60) {
      return <td>C</td>
    } else if (score >= 55) {
      return <td>C-</td>
    } else if (score >= 50) {
      return <td>D</td>
    } else {
      return <td>F</td>
    }
  };

// 'gradeDisplay' need to be implemented, might need api call.
  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>{userInfo.username} Profile</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
      </div>
      <br/><br/>
      <div className='gradeDisplay'>
        <table>
          <tr>
            {grades.map((ques) => {return <th>Question #{ques.questionId}</th>})}
            <th>Average Scores</th>
          </tr>
          <tr>
            {grades.map((ques) => {
              if (ques.testCorrect === -1) {
                return <td>N/A</td>
              } else {
                return <td>{Math.round(10 * 100 * (ques.testCorrect/ques.testTotal))/10}%</td>
              }
            })}
            <td>{getAverageScore(grades)}%</td>
          </tr>
          <tr>
            {grades.map((ques) => {
              if (ques.testCorrect === -1) {
                return <td>N/A</td>
              } else {
                const side = 90;
                const score = Math.round(10 * 100 * (ques.testCorrect/ques.testTotal))/10;
                return renderSticker(score, side)
              }
            })}
            {renderSticker(getAverageScore(grades), 90)}
          </tr>
        </table>
      </div>

      <div className='buttonContainer'>
        <button title="Logout" className='logoutButton' onClick={onLogoutButtonClicked}>Logout</button>
      </div>

      <div className='changePassword' style={{ display: researcher ? "none" : "block" }}>
        <div className={'title'}>
          <div>Change Password</div>
        </div>
        <br/>
        <div className={'input'}>
          <input
            value={oldPassword}
            placeholder="Old Password..."
            onChange={(ev) => setOldPassword(ev.target.value)}
            className={'inputBox'}
            type={showOldPassword ? 'text' : 'password'}
            maxLength="20"
            id = {'oldPassword'}
          />
          <label>
              <input
              value={showOldPassword}
              className={'inputBox'}
              type = "checkbox"
              onChange={() => setShowOldPassword(!showOldPassword)}
              id = "showPass"
              />
              <label>Show Old Password</label>
          </label>
        </div>

        <div className={'input'}>
          <input
            value={newPassword}
            placeholder="New Password..."
            onChange={(ev) => setNewPassword(ev.target.value)}
            className={'inputBox'}
            type={showNewPassword ? 'text' : 'password'}
            maxLength="20"
            id = {'newPassword'}
          />
          <label>
              <input
              value={showNewPassword}
              className={'inputBox'}
              type = "checkbox"
              onChange={() => setShowNewPassword(!showNewPassword)}
              id = "showPass"
              />
              <label>Show New Password</label>
          </label>
        </div>

        <div className={'input'}>
          <input
            value={confirmNewPassword}
            placeholder="Confirm New Password..."
            onChange={(ev) => setConfirmNewPassword(ev.target.value)}
            className={'inputBox'}
            type={showConfirmNewPassword ? 'text' : 'password'}
            maxLength="20"
            id = {'confirmNewPassword'}
          />
          <label>
              <input
              value={showConfirmNewPassword}
              className={'inputBox'}
              type = "checkbox"
              onChange={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              id = "showPass"
              />
              <label>Show Confirm New Password</label>
          </label>
        </div>
        <br/>
        <div className="errorLabel">
          <label>{error}</label>
        </div>
        <div className={'input'}>
          <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Change Password'} />
        </div>
      </div>
      <div className='buttonContainer' style={{ display: researcher ? "none" : "block" }}>
        <button title="Delete Account" disabled={enabled} className='deleteButton' onClick={onDeleteButtonClicked}>Delete Account</button>
      </div>
      <label id = "enabled" style={{ display: researcher ? "none" : "block" }}>
        <input
        value={enabled}
        className={'inputBox'}
        type = "checkbox"
        onChange={() => setEnabled(!enabled)}
        />
        <label>Are you sure you'd like to delete your account and all of its related data?</label>
      </label>
    </div>
  )
}

export default Profile