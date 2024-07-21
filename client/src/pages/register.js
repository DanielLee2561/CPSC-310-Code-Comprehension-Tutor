// STILL IN PROGRESS

// REFERENCE: 
// https://clerk.com/blog/building-a-react-login-page-template
// https://www.robinwieruch.de/react-checkbox/

// import "./register.css";
import "./authentication.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const textConsent = "By registering an account, you consent to having the following data be collected and analyzed. This includes your description, notes, generated code, failed tests, score, and duration for each question. Your data will be linked to your username.";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const onLoginClick = () => {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmpassword");
    console.log(username + " " + password + " " + confirmPassword + " " + consent);
    if ((username === "") || (username.length < 5)) {
      setError("ERROR: Input a username that is at least 5 characters long to register");
      setIsLoading(false);
      return;
    }
    if ((password === "") || (password.length < 5)) {
      setError("ERROR: Input a password that is at least 5 characters long to register");
      setIsLoading(false);
      return;
    }
    if (password!==confirmPassword){
      setError("ERROR: Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!consent){
      setError("ERROR: Consent is required to register");
      setIsLoading(false);
      return;
    }

    let valid = false;
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        username,
        password
      });
      
      valid = res.status === 201 ? true : false;
    } catch (err) {
      setError(err.response.data.message);
    } 
    if (!valid) {
      setError("ERROR: Username is already taken");
      setIsLoading(false);
      return;
    } else {
      navigate("/");
    }
  };
  return (
    <div className={'main'}>
      <div className={'title'}>
        <div>Register</div>
      </div>
      <br/>
      <form onSubmit={handleSubmit}>
        <div className={'input'}>
          <input name="username" type="text" placeholder="Username" />
        </div>
        <br/>
        <div className={'input'}>
          <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" id="password" />
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
          <input name="confirmpassword" type= {showPasswordConfirmation ? 'text' : 'password'} placeholder="Confirm Password" id="passwordConfirmation" />
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
        <div className={'input consent'}>
            <div className={'consentText'}>
              <label>{textConsent}</label>
            </div>
            <input
            value={consent}
            className={'inputBox'}
            type = "checkbox"
            onChange={() => setConsent(!consent)}
            />
            <span className={'consentText'}>Agree</span>
        </div>
        <br/>
        <div className="errorLabel">
          <label>{error}</label>
        </div>
        <div className={'input'}>
          <input className={'loginButton'} type="button" onClick={onLoginClick} value={'Already have an account, Login'} />
          <input className={'inputButton'} disabled={isLoading} type="submit" value={'Register'} />
        </div>
      </form>
    </div>

    // <div className="registerPage">
    //   <div className="formContainer">
    //     <form onSubmit={handleSubmit}>
    //       <h1>Register</h1>
    //       <input name="username" type="text" placeholder="Username" required />
    //       <input name="password" type="password" placeholder="Password" required />
    //       <input name="confirmpassword" type="password" placeholder="Confirm Password" required />
    //       <div className="input">
    //         <input
    //           type="checkbox"
    //           checked={consent}
    //           onChange={() => setConsent(!consent)}
    //           id="consent"
    //           required
    //         />
    //         <label htmlFor="consent">I agree to the terms and conditions</label>
    //       </div>
    //       <button disabled={isLoading}>Register</button>
    //       {error && <span>{error}</span>}
    //       <Link to="/login">Do you have an account?</Link>
    //     </form>
    //   </div>
     
    // </div>
  );
}

export default Register;