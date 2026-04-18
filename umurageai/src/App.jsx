import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Home from './pages/Home'
import Community from './pages/Community'
import Record from './pages/Record'
import Family from './pages/Family'
import ElderProfile from './pages/ElderProfile'
import YouthProfile from './pages/YouthProfile'
import Notifications from './pages/Notifications'

import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/record" element={<Record />} />
            <Route path="/family" element={<Family />} />
            <Route path="/profile/elder" element={<ElderProfile />} />
            <Route path="/profile/youth" element={<YouthProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </AuthProvider>
  )
}

export default App