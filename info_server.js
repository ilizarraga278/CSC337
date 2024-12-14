import express from"express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static("public"));

const PORT = 8001
const MONGO_URL = "mongodb://127.0.0.1:27017/FinalProject"

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

//Connect to MongoDB
mongoose.connect(MONGO_URL).then(() => {
  console.log("Database is connected successfully.");
}).catch((error) => console.log(error));
// User Schema
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    year: Number,
    month: Number,
    day: Number,
    fortunes: { type: [String], default: [] }, // Empty array initialized by default
  });

// Create Mongoose model
const UserModel = mongoose.model("users", userSchema);

app.get("/",(req,res)=>{
  res.sendFile(path.resolve(__dirname,'welcome_page.html'));
});

// POST endpoint to create a user profile
app.post("/createProfileForm", (req, res) => {
    const { name, username, email, year, month, day } = req.body;

    // Create a new User instance with an empty fortunes array by default
    const newUser = new UserModel({
      name,
      username,
      email,
      year,
      month,
      day,
      fortunes: [] // Explicitly initializing an empty array, though it's already the default
    });

  // Save the user data to the database
  newUser
    .save()
    .then(() => {
      res.json({ message: "User profile created successfully!" });
    })
    .catch((error) => {
      console.error("Error saving user profile:", error);
      res.status(500).json({ message: "There was an error saving the profile." });
    });
});

// Start the server
app.listen(8001, () => {
  console.log(`Server running on http://143.198.79.177:8001/`);
});

app.listen(8000,() =>{
    console.log(`Server running on http://143.198.79.177:8000/`);
});
