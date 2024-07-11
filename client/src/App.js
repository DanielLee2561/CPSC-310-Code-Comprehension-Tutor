import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import Questions from './pages/questions'
import AttemptPage from './pages/AttemptPage'
import Profile from './pages/profile'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
   //  hold username and password after login
   const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  // Function to update user data after login
  const handleLogin = (username, password) => {
    setUserData({ username, password });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/attempt" element={
            <AttemptPage question_id={2} attempt_num={1} username={"Student_A"} password={"pStudent_A"}/>}
          />
          <Route path="/questions/:id/:attemptId" element={<AttemptPage username={"Student_A"} password={"pStudent_A"} />} />
          <Route path="/questions" element={<Questions username={"Student_A"} password={"pStudent_A"}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/"
            element={<Login onLogin={(username, password) => handleLogin(username, password)} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App