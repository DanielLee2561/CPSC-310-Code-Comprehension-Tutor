import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import Questions from './pages/questions'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App