import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/signup', { username, phone, email,password });
      setIsOtpSent(true);
      alert('OTP sent to your email!');
    } catch (error) {
      console.error(error);
      alert('Error sending OTP!');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/verify-otp', { email, otp });
      alert('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Invalid OTP!');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={isOtpSent ? verifyOtp : handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">{isOtpSent ? 'Verify OTP' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default Signup;
