// STILL IN PROGRESS

// REFERENCE: 
// https://clerk.com/blog/building-a-react-login-page-template
// https://www.robinwieruch.de/react-checkbox/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const navigate = useNavigate()

  const onButtonClick = () => {
    if ((username === "") || (username.length < 5)) {
      setError("ERROR: Input a username that is at least 5 characters long to register");
      return;
    }

    if ((password === "") || (password.length < 5)) {
      setError("ERROR: Input a password that is at least 5 characters long to register");
      return;
    }

    if (passwordConfirmation === "") {
      setError("ERROR: Retype your password to confirm it");
      return;
    }

    if (passwordConfirmation !== password) {
      setError("ERROR: Your passwords do not match");
      return;
    }

    if (consent === false) {
      setError("ERROR: Your consent is needed to continue registering your account");
      return;
    }

    console.log("Success"); // Still need API checks (username and actual registration to backend)
  }

  return (
    <div className={'main'}>
      <div className={'title'}>
        <div>Register</div>
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={username}
          placeholder="Username..."
          onChange={(ev) => setUsername(ev.target.value)}
          className={'inputBox'}
          maxLength={20}
          minLength={5}
        />
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={password}
          placeholder="Password..."
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
          maxLength={20}
          minLength={5}
          type= {showPassword ? 'text' : 'password'}
        />
        <label>
            <input
            value={showPassword}
            className={'inputBox'}
            type = "checkbox"
            onChange={() => setShowPassword(!showPassword)}
            id = "showPass"
            />
            <label>Show Password</label>
        </label>
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={passwordConfirmation}
          placeholder="Confirm Password..."
          onChange={(ev) => setPasswordConfirmation(ev.target.value)}
          className={'inputBox'}
          maxLength={20}
          minLength={5}
          type= {showPasswordConfirmation ? 'text' : 'password'}
        />
        <label>
            <input
            value={showPasswordConfirmation}
            className={'inputBox'}
            type = "checkbox"
            onChange={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            id = "showPass"
            />
            <label>Show Password Confirmation</label>
        </label>
      </div>
      <br/>
      <div className={'input'}>
          <input
          value={consent}
          className={'inputBox'}
          type = "checkbox"
          onChange={() => setConsent(!consent)}
          />
          <label>You Consent To This!!!</label>
      </div>
      <br/>
      <label className="errorLabel" style={{ color: 'red' }}>{error}</label>
      <div className={'input'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
      </div>
    </div>
  )
}

export default Register