const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://harsh:Vartakcollege2026@cluster0.ferntwt.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subdivision: {type: String,required: true}
});

const Admin = mongoose.model('Admin', adminSchema);

const admins = [
  { email: 'admin1@example.com', password: 'password123' }, // Replace with hashed passwords
  { email: 'admin2@example.com', password: 'password456' },
];

const addAdmins = async () => {
  try {
    await Admin.insertMany(admins);
    console.log('Admins added successfully');
  } catch (error) {
    console.error('Error adding admins:', error);
  } finally {
    mongoose.connection.close();
  }
};

addAdmins();
