

//PROXY
const path = require('path')
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const twilio = require('twilio');
const multer = require('multer');
const { type } = require('os');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://harsh:Vartakcollege2026@cluster0.ferntwt.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


// Replace with your actual Account SID and Auth Token from Twilio
const accountSid = 'ACda01a7cb6299b109b15e97e4d81fdc14';
const authToken = 'a260d5a09f8ab9f6646a7f3b88098da0';

const client = new twilio(accountSid, authToken);


const sendSMS = (userPhoneNumber, message) => {
    client.messages
      .create({
        body: message,
        from: '+1 973 556 2434', // Your Twilio phone number
        to: userPhoneNumber, // User's phone number
      })
      .then(message => console.log(`Message sent with SID: ${message.sid}`))
      .catch(err => console.error('Error sending SMS:', err));
  };


  app.post('/end-call', (req, res) => {
    const { userPhoneNumber, roomId } = req.body;
    console.log('Received phone number:', userPhoneNumber);
    console.log('Ending call for room:', roomId);


    if (!userPhoneNumber) {
        return res.status(400).json({ success: false, message: "Phone number is missing." });
      }

    const message = `Your document verification session for Room ID: ${roomId} has ended. Your verification is in progress.`;
    sendSMS(`+91${userPhoneNumber}`, message);

    res.send({ success: true, message: 'Call ended and SMS sent.' });
  });



  // Define Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  const Admin = mongoose.model('Admin', adminSchema);



  const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required:true},
  });

const User = mongoose.model('User', userSchema);


const otps = {};


let availableAdmins = [];
let activeRooms = new Map(); // To keep track of active room IDs and their participants

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mynameisharsh143@gmail.com',
        pass: 'dape pfpd knou fwgu'
    }
});

app.post('/admin-available', (req, res) => {
    const { adminId, email } = req.body;
    const adminExists = availableAdmins.find(admin => admin.adminId === adminId);
    if (!adminExists) {
        availableAdmins.push({ adminId, email });
        console.log('Admin added:', availableAdmins);
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Admin is already available.' });
    }
});

app.post('/request-session', (req, res) => {
    const { userId, userEmail } = req.body;
    if (availableAdmins.length > 0) {
        const admin = availableAdmins.shift();
        const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
        activeRooms.set(roomId, { adminId: admin.adminId, userId: userId }); // Add the room ID to active rooms

        const mailOptionsUser = {
            from: 'your-email@gmail.com',
            to: userEmail,
            subject: 'Your Verification Room ID',
            text: `Room ID: ${roomId} - You can join the room for verification.`
        };
        const mailOptionsAdmin = {
            from: 'your-email@gmail.com',
            to: admin.email,
            subject: 'Assigned Verification Room',
            text: `Room ID: ${roomId} - You have been assigned a verification session.`
        };

        transporter.sendMail(mailOptionsUser, (error, info) => {
            if (error) {
                return console.log('Error sending user email: ', error);
            }
            console.log('User email sent: ', info.response);
        });

        transporter.sendMail(mailOptionsAdmin, (error, info) => {
            if (error) {
                return console.log('Error sending admin email: ', error);
            }
            console.log('Admin email sent: ', info.response);
        });

        res.json({ success: true, roomId });
    } else {
        res.json({ success: false, message: 'No admin is available currently.' });
    }
});

app.post('/verify-room', (req, res) => {
    const { roomId } = req.body;
    if (activeRooms.has(roomId)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (roomId, userId, isAdmin) => {
        console.log(`User ${userId} joining room: ${roomId}, isAdmin: ${isAdmin}`);

        const room = activeRooms.get(roomId);
        if (!room) {
            socket.emit('room-error', 'Room not found');
            return;
        }

        if (isAdmin && userId !== room.adminId) {
            socket.emit('room-error', 'Unauthorized admin');
            return;
        }

        if (!isAdmin && userId !== room.userId) {
            socket.emit('room-error', 'Unauthorized user');
            return;
        }

        socket.join(roomId);

        // Notify the other participant that someone has joined
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            socket.to(roomId).emit('user-disconnected', userId);

            // Remove the room if either participant disconnects
            activeRooms.delete(roomId);
        });

        // Handle video offer
        socket.on('video-offer', (offer) => {
            socket.to(roomId).emit('video-offer', offer);
        });

        // Handle video answer
        socket.on('video-answer', (answer) => {
            socket.to(roomId).emit('video-answer', answer);
        });

        // Handle ICE candidates
        socket.on('ice-candidate', (candidate) => {
            socket.to(roomId).emit('ice-candidate', candidate);
        });
    });
});



//AUTHSYSTEM USER

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, phone, email ,password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Save user data to MongoDB
    try {
      const newUser = new User({ username, phone, email ,password});
      await newUser.save();

      otps[email] = otp;

      // Send OTP to email
      transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      res.status(200).send('OTP sent to your email!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving user data!');
    }
  });



// Verify OTP Route
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otps[email] && otps[email] == otp) {
      delete otps[email]; // OTP is valid, delete it
      res.status(200).send('Signup successful!');
    } else {
      res.status(400).send('Invalid OTP!');
    }
  });



  // Login Route
  app.post('/api/login', async (req, res) => {
    const { email, phone } = req.body;

    try {
      // Check if user exists in the database
      const user = await User.findOne({ email, phone });
      if (user) {
        res.status(200).send('Login successful!');
      } else {
        res.status(401).send('Invalid email or phone number!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during login!');
    }
  });


// Verify Login OTP Route
//   app.post('/api/verify-login-otp', (req, res) => {
//     const { email, otp } = req.body;
//     if (otps[email] && otps[email] == otp) {
//       delete otps[email]; // OTP is valid, delete it
//       res.status(200).send('Login successful!');
//     } else {
//       res.status(400).send('Invalid OTP!');
//     }
//   });


//AUTH ADMIN

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the admin user in the database
      const admin = await Admin.findOne({ email });

      if (!admin || admin.password !== password) { // In production, use hashed passwords and compare them
        return res.status(401).send('Invalid email or password!');
      }

      res.status(200).send('Admin login successful!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during admin login!');
    }
  });


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
