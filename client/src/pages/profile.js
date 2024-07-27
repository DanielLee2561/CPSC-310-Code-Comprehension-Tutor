// REFERENCE: https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
// https://stackoverflow.com/questions/71500670/uselocation-hook-keeps-states-even-on-hard-refresh

import React, { useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import './header.css'
import './profile.css'

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
    }
  })

  const onHomeButtonClicked = () => {

    navigate("/home", {state: userInfo});
  }

  const onProfileButtonClicked = () => {

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
    const password = userInfo.password;
    await axios.delete("http://localhost:5000/users/" + username, {
      data: {
        password
      }
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


  return (
    <div className="mainContainer">
      <div className="header">
        <button title="Go To Home Page" className='homeButton' onClick={onHomeButtonClicked}><span className='headerSpan'>Home</span></button>
        <h1 className='headerTitle'>{userInfo.username} Profile</h1>
        <button title="Go To Profile Page" className='profileButton' onClick={onProfileButtonClicked}><span className='headerSpan'>Profile</span></button>
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