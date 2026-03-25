import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './Components/Navigation/navbar'
import FullScreenNav from './Components/Navigation/FullScreenNav'
import DarkVeil from './Components/DarkVeil'
import Dashboard from './pages/Dashboard'
import AddLawyer from './pages/AddLawyer'
import AddNgo from './pages/AddNgo'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase() === '/login';

  return (
    <AuthProvider>
      <div >
        <DarkVeil />
        {!isLoginPage && <Navbar/>}
        {!isLoginPage && <FullScreenNav/>}
        <Routes>
          <Route path='/' element={<Home/>} ></Route>
          <Route path='/login' element={<Login/>} ></Route>
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} ></Route>
          <Route path='/add-lawyer' element={<ProtectedRoute><AddLawyer/></ProtectedRoute>} ></Route>
          <Route path='/add-ngo' element={<ProtectedRoute><AddNgo/></ProtectedRoute>} ></Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App