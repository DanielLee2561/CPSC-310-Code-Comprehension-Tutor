// STILL IN PROGRESS

// REFERENCE: 
// https://clerk.com/blog/building-a-react-login-page-template
// https://www.robinwieruch.de/react-checkbox/

import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";


function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmpassword");
    if ((username === "") || (username.length < 5)) {
      setError("ERROR: Input a username that is at least 5 characters long to register");
      return;
    }
    if ((password === "") || (password.length < 5)) {
      setError("ERROR: Input a password that is at least 5 characters long to register");
      return;
    }
    if (password!==confirmPassword){
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!consent){
      setError("Must agree to the consent");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        username,
        password
      });
      
      console.log(res);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } 
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <input name="confirmpassword" type="password" placeholder="Confirm Password" required />
          <div className="input">
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              id="consent"
              required
            />
            <label htmlFor="consent">I agree to the terms and conditions</label>
          </div>
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
     
    </div>
  );
}

export default Register;