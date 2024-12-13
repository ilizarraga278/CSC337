import express from"express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { addFortune, getFortunes, getMostRecent, initAllJournals } from "./journal_store";


const app = express();

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
  await initAllJournals();
  console.log('allJournals initialized');
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

app.get("/user_info/:username",(req,res) => {
  const {username} = req.params;
  UserModel.findOne({username})
  .then((user) => {
    if (!user){
      return res.status(404).json({message:'User profile not found'});
    }
    res.status(200).json(user);
  })
  .catch((error) =>{
    console.error('Error finding user:',error);
    res.status(500).json({message: 'There was an error fetching the user'});
  });
});

app.post("/journals/:username/add", (req,res) => {
    const {username} = req.params;
    const {fortune} = req.body;
    if (!fortune){
      return res.status(400).json({message:'Fortune is required for add'});
    }
    addFortune(username,fortune)
    .then((updatedJournal) => {
      res.json({message:'Fortune Successfully Added',updatedJournal});
    })
    .catch((error) => {
      console.error('Error adding fortune',error);
      res.status(500).json({message:"Unable to add fortune"});
    });
});

app.get("/journals/:username",(req,res) => {
    const {username} = req.params;
    getFortunes(username)
    .then((fortunes) => {
      res.json({username,fortunes});
    })
    .catch((error) => {
      console.error("Error retrieving journal",error);
      res.status(500).json({error:'Error retrieving fortunes'});
    });
});

app.get("/journals/:username/recent", (req,res) => {
    const {username} = req.params;
    getMostRecent(username)
    .then((mostRecentFortune) => {
      if (!mostRecentFortune) {
        return res.status(404).json({error:'No recent fortune in journal'});
      }
      res.json({username,mostRecentFortune});
    })
    .catch((error) => {
      console.error('Error retrieving most recent fortune',error);
      res.status(500).json({error:'There was an error retrieving the recent fortune'})
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});