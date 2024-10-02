import React, { useState } from 'react';
import './AdminAvailability.css'

function AdminAvailability() {
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminId || !email) {
      setStatus('Please enter both admin ID and email.');
      return;
    }

    // API call to mark admin as available
    const response = await fetch('http://localhost:3001/admin-available', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, email })
    });

    const data = await response.json();
    if (data.success) {
      setStatus('You are now marked as available.');
    } else {
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h1>Admin Availability</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Admin ID: </label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            placeholder="Enter your admin ID"
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Mark as Available</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default AdminAvailability;
