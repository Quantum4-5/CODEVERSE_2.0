import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Optional CSS file for styling
// import './VideoCall.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, phone });
      if(response.status === 200){
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhoneNumber',phone)
        alert(response.data);// Show success message
        navigate('/'); // Redirect to the home page or dashboard after successful login
      } else {
        alert("login failed! ")
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data); // Show error message
    }
  };

  return (
    <div className='main-login'>
        <div className='img-div'>
        <img
         className='login-img'
          src='../login.jpg'
          alt='login_img'
        />
        </div>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
