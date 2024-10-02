// import React, { useRef, useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001');

// function VideoCall() {
//   const [roomId, setRoomId] = useState('');
//   const [isInRoom, setIsInRoom] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerConnectionRef = useRef(null);

//   useEffect(() => {
//     socket.on('video-offer', handleReceiveOffer);
//     socket.on('video-answer', handleAnswer);
//     socket.on('ice-candidate', handleNewICECandidateMsg);
//     socket.on('user-connected', handleUserConnected);
//     socket.on('user-disconnected', handleUserDisconnected);

//     return () => {
//       socket.off('video-offer', handleReceiveOffer);
//       socket.off('video-answer', handleAnswer);
//       socket.off('ice-candidate', handleNewICECandidateMsg);
//       socket.off('user-connected', handleUserConnected);
//       socket.off('user-disconnected', handleUserDisconnected);
//     };
//   }, []);

//   const handleUserConnected = () => {
//     console.log('User connected');
//     createOffer();
//   };

//   const handleUserDisconnected = () => {
//     console.log('User disconnected');
//     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//   };

//   const handleReceiveOffer = async (offer) => {
//     console.log('Received video offer');
//     const pc = createPeerConnection();
//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     socket.emit('video-answer', answer, roomId);
//   };

//   const handleAnswer = async (answer) => {
//     console.log('Received video answer');
//     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleNewICECandidateMsg = async (candidate) => {
//     console.log('Received new ICE candidate');
//     const iceCandidate = new RTCIceCandidate(candidate);
//     await peerConnectionRef.current.addIceCandidate(iceCandidate);
//   };

//   const createPeerConnection = () => {
//     const pc = new RTCPeerConnection();
//     peerConnectionRef.current = pc;

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId);
//       }
//     };

//     pc.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     localStreamRef.current.getTracks().forEach((track) => {
//       pc.addTrack(track, localStreamRef.current);
//     });

//     return pc;
//   };

//   const createOffer = async () => {
//     const pc = createPeerConnection();
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit('video-offer', offer, roomId);
//   };

//   const joinRoom = async () => {
//     if (roomId) {
//       // Verify the room exists before joining
//       const response = await fetch(`http://localhost:3001/verify-room/${roomId}`);
//       const data = await response.json();

//       if (data.valid) {
//         setIsVerified(true);
//         await startLocalStream();
//         socket.emit('join-room', roomId);
//         setIsInRoom(true);
//       } else {
//         alert('Room does not exist');
//       }
//     }
//   };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localStreamRef.current = stream;
//     localVideoRef.current.srcObject = stream;
//   };

//   const generateRoom = async () => {
//     const response = await fetch('http://localhost:3001/generate-room');
//     const data = await response.json();
//     setRoomId(data.roomId); // Set the newly generated room ID
//   };

//   return (
//     <div>
//       <h1>Video Call App</h1>
//       {!isInRoom && !isVerified && (
//         <div>
//           <button onClick={generateRoom}>Generate Room</button>
//           <input
//             type="text"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             placeholder="Enter or Paste Room ID"
//           />
//           <button onClick={joinRoom}>Join Room</button>
//         </div>
//       )}

//       <div>
//         <video ref={localVideoRef} autoPlay playsInline muted></video>
//         <video ref={remoteVideoRef} autoPlay playsInline></video>
//       </div>
//     </div>
//   );
// }

// export default VideoCall;





//WORKING


// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001');

// function VideoCall() {
//   const [roomId, setRoomId] = useState('');
//   const [isInRoom, setIsInRoom] = useState(false);
//   const [verificationStep, setVerificationStep] = useState('request'); // 'request', 'verify', or 'call'
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const [userId] = useState('user-123');

//   useEffect(() => {
//     socket.on('video-offer', handleReceiveOffer);
//     socket.on('video-answer', handleAnswer);
//     socket.on('ice-candidate', handleNewICECandidateMsg);
//     socket.on('user-connected', handleUserConnected);
//     socket.on('user-disconnected', handleUserDisconnected);

//     return () => {
//       socket.off('video-offer', handleReceiveOffer);
//       socket.off('video-answer', handleAnswer);
//       socket.off('ice-candidate', handleNewICECandidateMsg);
//       socket.off('user-connected', handleUserConnected);
//       socket.off('user-disconnected', handleUserDisconnected);
//     };
//   }, []);

//   useEffect(() => {
//     if (isInRoom && localVideoRef.current && !localStreamRef.current) {
//       setupLocalStream();
//     }
//   }, [isInRoom]);

//   const setupLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       alert('Failed to access camera and microphone. Please check your permissions.');
//     }
//   };

//   const handleUserConnected = () => {
//     console.log('User connected');
//     createOffer();
//   };

//   const handleUserDisconnected = () => {
//     console.log('User disconnected');
//     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//   };

//   const handleReceiveOffer = async (offer) => {
//     console.log('Received video offer');
//     const pc = createPeerConnection();
//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     socket.emit('video-answer', answer, roomId);
//   };

//   const handleAnswer = async (answer) => {
//     console.log('Received video answer');
//     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleNewICECandidateMsg = async (candidate) => {
//     console.log('Received new ICE candidate');
//     const iceCandidate = new RTCIceCandidate(candidate);
//     await peerConnectionRef.current.addIceCandidate(iceCandidate);
//   };

//   const createPeerConnection = () => {
//     const pc = new RTCPeerConnection();
//     peerConnectionRef.current = pc;

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId);
//       }
//     };

//     pc.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         pc.addTrack(track, localStreamRef.current);
//       });
//     }

//     return pc;
//   };

//   const createOffer = async () => {
//     const pc = createPeerConnection();
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit('video-offer', offer, roomId);
//   };

//   const joinRoom = () => {
//     socket.emit('join-room', roomId, userId);
//     setIsInRoom(true);
//   };

//   const requestSession = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/request-session', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, userEmail: 'mynameisharsh143@gmail.com' }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         // No longer automatically setting roomId here
//         setVerificationStep('verify');
//         alert(`Room ID has been sent to your email. Please check and enter it to join the call.`);
//       } else {
//         alert('No admin is available currently.');
//       }
//     } catch (error) {
//       console.error('Error requesting session:', error);
//       alert('Failed to request session. Please try again.');
//     }
//   };

//   const verifyRoomId = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/verify-room', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ roomId }),
//       });

//       const data = await response.json();
//       if (data.valid) {
//         setVerificationStep('call');
//       } else {
//         alert('Invalid room ID. Please check and try again.');
//       }
//     } catch (error) {
//       console.error('Error verifying room ID:', error);
//       alert('Failed to verify room ID. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h1>Video Verification System</h1>

//       {verificationStep === 'request' && (
//         <div>
//           <button onClick={requestSession}>Request Session</button>
//         </div>
//       )}

//       {verificationStep === 'verify' && (
//         <div>
//           <input
//             type="text"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             placeholder="Enter Room ID from your email"
//           />
//           <button onClick={verifyRoomId}>Verify Room ID</button>
//         </div>
//       )}

//       {verificationStep === 'call' && !isInRoom && (
//         <div>
//           <button onClick={joinRoom}>Join Room</button>
//         </div>
//       )}

//       {isInRoom && (
//         <div>
//           <div>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               style={{ width: '300px', height: 'auto', backgroundColor: 'black' }}
//             ></video>
//           </div>
//           <div>
//             <video
//               ref={remoteVideoRef}
//               autoPlay
//               playsInline
//               style={{ width: '300px', height: 'auto', backgroundColor: 'black' }}
//             ></video>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoCall;

//PROXY

import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
// import './VideoCall.css'


const socket = io('http://localhost:3001');

function VideoCall() {

    const styles = {
        container: {
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        header: {
          color: '#333',
          textAlign: 'center',
          marginBottom: '30px',
        },
        button: {
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s',
        },
        input: {
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '16px',
        },
        videoContainer: {
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
        },
        video: {
          width: '48%',
          backgroundColor: 'black',
          borderRadius: '8px',
          overflow: 'hidden',
        },
        endCallButton: {
          backgroundColor: '#f44336',
          marginTop: '20px',
        },
      };


  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [verificationStep, setVerificationStep] = useState('request'); // 'request', 'verify', or 'call'
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is the admin or not
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [userId] = useState('user-123');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');

  useEffect(() => {

    const storedPhoneNumber = localStorage.getItem('userPhoneNumber');
    if (storedPhoneNumber) {
      setUserPhoneNumber(storedPhoneNumber);
    }


    socket.on('video-offer', handleReceiveOffer);
    socket.on('video-answer', handleAnswer);
    socket.on('ice-candidate', handleNewICECandidateMsg);
    socket.on('user-connected', handleUserConnected);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('end-call', handleEndCall); // Listen for call end event

    return () => {
      socket.off('video-offer', handleReceiveOffer);
      socket.off('video-answer', handleAnswer);
      socket.off('ice-candidate', handleNewICECandidateMsg);
      socket.off('user-connected', handleUserConnected);
      socket.off('user-disconnected', handleUserDisconnected);
      socket.off('end-call', handleEndCall); // Clean up the event listener
    };
  }, []);

  useEffect(() => {
    if (isInRoom && localVideoRef.current && !localStreamRef.current) {
      setupLocalStream();
    }
  }, [isInRoom]);

  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera and microphone. Please check your permissions.');
    }
  };

  const handleUserConnected = () => {
    console.log('User connected');
    createOffer();
  };

  const handleUserDisconnected = () => {
    console.log('User disconnected');
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const handleReceiveOffer = async (offer) => {
    console.log('Received video offer');
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('video-answer', answer, roomId);
  };

  const handleAnswer = async (answer) => {
    console.log('Received video answer');
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidateMsg = async (candidate) => {
    console.log('Received new ICE candidate');
    const iceCandidate = new RTCIceCandidate(candidate);
    await peerConnectionRef.current.addIceCandidate(iceCandidate);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    // Sending ICE candidates to the other peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, roomId);
      }
    };

    // Receiving remote video stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Adding local video stream to the peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('video-offer', offer, roomId);
  };

  const joinRoom = () => {
    socket.emit('join-room', roomId, userId);
    setIsInRoom(true);
  };

  const requestSession = async () => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const response = await fetch('http://localhost:3001/request-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, userSubdivision: 'subdivision-1' }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationStep('verify');
        alert(`Room ID has been sent to your email. Please check and enter it to join the call.`);
      } else {
        alert('No admin is available currently.');
      }
    } catch (error) {
      console.error('Error requesting session:', error);
      alert('Failed to request session. Please try again.');
    }
  };

  const verifyRoomId = async () => {
    try {
      const response = await fetch('http://localhost:3001/verify-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();
      if (data.valid) {
        setVerificationStep('call');
      } else {
        alert('Invalid room ID. Please check and try again.');
      }
    } catch (error) {
      console.error('Error verifying room ID:', error);
      alert('Failed to verify room ID. Please try again.');
    }
  };

  const handleRoleSelection = (role) => {
    setIsAdmin(role === 'admin');
    setVerificationStep('verify');
  };

 const endCall = () => {
    console.log('Sending SMS to:', userPhoneNumber);
    socket.emit('end-call', roomId);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsInRoom(false);

    // Send SMS via backend after ending the call
    fetch('http://localhost:3001/end-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPhoneNumber,
        roomId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('SMS sent successfully');
        } else {
          console.error('Error sending SMS');
        }
      })
      .catch(error => console.error('Error:', error));
  };
  const handleEndCall = () => {
    // Handle when the call is ended by the admin
    console.log('Call ended by admin');
    setIsInRoom(false);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    // <div>
    //   <h1>Video Verification System</h1>

    //   {verificationStep === 'request' && (
    //     <div>
    //       <button onClick={requestSession}>Request Session</button>
    //       <div style={{ marginTop: '20px' }}>
    //         <button onClick={() => handleRoleSelection('admin')}>Admin Login</button>
    //       </div>
    //     </div>
    //   )}

    //   {verificationStep === 'verify' && (
    //     <div>
    //       <input
    //         type="text"
    //         value={roomId}
    //         onChange={(e) => setRoomId(e.target.value)}
    //         placeholder="Enter Room ID from your email"
    //       />
    //       <button onClick={verifyRoomId}>Verify Room ID</button>
    //     </div>
    //   )}

    //   {verificationStep === 'call' && !isInRoom && (
    //     <div>
    //       <button onClick={joinRoom}>Join Room</button>
    //     </div>
    //   )}

    //   {isInRoom && (
    //     <div>
    //       <div>
    //         <h2>{isAdmin ? 'Admin View' : 'User View'}</h2>
    //         <video
    //           ref={localVideoRef}
    //           autoPlay
    //           playsInline
    //           muted
    //           style={{ width: '300px', height: 'auto', backgroundColor: 'black' }}
    //         ></video>
    //       </div>
    //       <div>
    //         <h2>Remote Video (Admin/User)</h2>
    //         <video
    //           ref={remoteVideoRef}
    //           autoPlay
    //           playsInline
    //           style={{ width: '300px', height: 'auto', backgroundColor: 'black' }}
    //         ></video>
    //       </div>
    //       {isAdmin && (
    //         <div style={{ marginTop: '20px' }}>
    //           <button onClick={endCall}>End Video Call</button>
    //         </div>
    //       )}
    //     </div>
    //   )}
    // </div>


    <div style={styles.container}>
    <h1 style={styles.header}>Video Verification System</h1>

    {verificationStep === 'request' && (
      <div>
        <button style={styles.button} onClick={requestSession}>Request Session</button>
        <div style={{ marginTop: '20px' }}>
          <button style={styles.button} onClick={() => handleRoleSelection('admin')}>Admin Login</button>
        </div>
      </div>
    )}

    {verificationStep === 'verify' && (
      <div>
        <input
          style={styles.input}
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID from your email"
        />
        <button style={styles.button} onClick={verifyRoomId}>Verify Room ID</button>
      </div>
    )}

    {verificationStep === 'call' && !isInRoom && (
      <div>
        <button style={styles.button} onClick={joinRoom}>Join Room</button>
      </div>
    )}

    {isInRoom && (
      <div>
        <div style={styles.videoContainer}>
          <div style={styles.video}>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>{isAdmin ? 'Admin View' : 'User View'}</h2>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: 'auto' }}
            ></video>
          </div>
          <div style={styles.video}>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Remote Video (Admin/User)</h2>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: 'auto' }}
            ></video>
          </div>
        </div>
        {isAdmin && (
          <div style={{ textAlign: 'center' }}>
            <button style={{ ...styles.button, ...styles.endCallButton }} onClick={endCall}>End Video Call</button>
          </div>
        )}
      </div>
    )}
  </div>
  );
}

export default VideoCall;
