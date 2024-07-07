import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import Questions from './pages/questions'
import AttemptPage from './pages/AttemptPage'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/attempt" element={
            <AttemptPage question_id={2} attempt_num={1} username={"Student_A"} password={"pStudent_A"}/>}
          />
          <Route path="/questions" element={<Questions />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App