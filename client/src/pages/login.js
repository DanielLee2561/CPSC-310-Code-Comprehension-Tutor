// REFERENCE: https://clerk.com/blog/building-a-react-login-page-template
// REFERENCE: https://www.geeksforgeeks.org/how-to-show-and-hide-password-in-reactjs/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authentication.css'

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onRegisterClick = () => {
    navigate("/register");
  }

  const onButtonClick = async () => {
    if (username === "") {
      setError("ERROR: Input a username");
      return;
    }

    if (password === "") {
      setError("ERROR: Input a password");
      return;
    }

    // API call here 
    let valid = false;
    let userInput = {
      username:username,
      password:password
    };
    await fetch("/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInput),
      method: "PUT"
      }
    ).then(res => res.json()).then(data => {
      valid = data.login;
      console.log(valid); // For testing can be removed
    })
    if (valid) {
      navigate("/home");
      return;
    } else {
      setError("ERROR: Username or password is incorrect");
      return;
    }
  }

  // Username and password max of 20 characters

  return (
    <div className={'main'}>
      <div className={'title'}>
        <div>Login</div>
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={username}
          placeholder="Username..."
          onChange={(ev) => setUsername(ev.target.value)}
          className={'inputBox'}
          maxLength="20"
        />
      </div>
      <br/>
      <div className={'input'}>
        <input
          value={password}
          placeholder="Password..."
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
          type={showPassword ? 'text' : 'password'}
          maxLength="20"
          id = {'password'}
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
      <div className="errorLabel">
        <label>{error}</label>
      </div>
      {/* <br/> */}
      {/* <div>
        <input className={'registerButton'} type="button" onClick={onRegisterClick} value={'Don’t have an account? Register here'} />
      </div>
      <br/> */}
      <div className={'input'}>
        <input className={'registerButton'} type="button" onClick={onRegisterClick} value={'Don’t have an account? Register here'} />
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login