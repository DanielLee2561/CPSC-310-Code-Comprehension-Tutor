import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import QuestionsPage from './pages/questions'
import AttemptPage from './pages/AttemptPage'
import Profile from './pages/profile'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
   
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/attempt" element={
            <AttemptPage question_id={2} attempt_num={1} username={"Student_A"} password={"pStudent_A"}/>}
          />
          <Route path="/questions/:id/:attemptId" element={<AttemptPage sername={"Student_A"} password={"pStudent_A"} />} />
          <Route path="/question_bank" element={<QuestionsPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
