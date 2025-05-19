import React from 'react'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Signin from './pages/Signin'
import About from './pages/About'
import Header from './components/Header'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Profile from './pages/Profile'
import DecompressorPage from './pages/DecompressPage'
// import './app.css'

export default function App() {
  return (
    <div>
     <BrowserRouter>
     {/* header */}
     <Header/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/decrypt" element={<DecompressorPage/>}/>
    </Routes>
      
    </BrowserRouter>
      
    </div>
  )
}
