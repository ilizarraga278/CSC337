import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
// Initialize Express app
const app = express()

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(__dirname));
app.use(express.json());

const PORT = process.env.PORT || 8000; // Default port is 8000 if not specified
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL)
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.get("/", (req, res) => {
  res.send("Server connection is successful") 
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  birthdate: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true }
  }
});
const User = mongoose.model('User', userSchema);

// POST route to handle form submission
app.post('/createProfileForm', async (req, res) => {
  
  const { name, username, email, birthdate } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists!" });
    }

    const newUser = new User({ name, username, email, birthdate });
    await newUser.save();
    res.redirect("/welcome_page.html");

  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: "Error creating profile." });
  }
});