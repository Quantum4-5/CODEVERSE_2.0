import { useState } from 'react'
import './App.css'
import VideoCall from './VideoCall'
import AdminAvailability from './AdminAvailability'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import AdminLogin from './AdminLogin';
import CasteIssuanceDocuments from './CasteIssuanceDocuments';
import Service from './Service';
import UserForm from './userForm';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Service/>}/>
      <Route path="/kyc" element={<VideoCall/>} />
      <Route path="/admin" element={<AdminAvailability/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/caste' element={<CasteIssuanceDocuments/>}/>
      <Route path='/form' element={<UserForm/>}/>
    </Routes>
</BrowserRouter>

  )
}

export default App
