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
  const [checked, setChecked] = useState(false);
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    navigate("/")
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
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={password}
          placeholder="Password..."
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={passwordConfirmation}
          placeholder="Confirm Password..."
          onChange={(ev) => setPasswordConfirmation(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordConfirmationError}</label>
      </div>
      <br/>
      <div className={'input'}>
        <label>
            <input
            value={passwordConfirmation}
            className={'inputBox'}
            type = "checkbox"
            />
        </label>
      </div>
      <br/>
      <div className={'input'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
      </div>
    </div>
  )
}

export default Register