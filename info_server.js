import express from"express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = 8001;
const MONGO_URL = "mongodb://127.0.0.1:27017/FinalProject";

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

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
  res.sendFile(path.join(__dirname,"public","welcome_page.html"));
});

// POST endpoint to create a user profile
app.post("/createProfileForm", (req, res) => {
    const { name, username, email, year, month, day } = req.body;

    // Check if user already exists
   /* const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
      if (existingUser) {
        return res.status(400).json({ message: "Username or Email already exists!" });
      }
*/
    
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

app.get("/getUsers", (req,res) => {
    UserModel.find({})
    .then(users => {
        res.json(users);
    })
    .catch(error => {
        console.error("error fetching users:",error);
        res.status(500).json({message: "Error fetching users"})
    });
});
    

app.get("/getHoroscope", (req,res) => {
    const {year,month,day} = req.query;
    if (!year || !month || !day) {
        return res.status(400).json({message: "Missing necessary data"});
    }
    UserModel.findOne({year,month,day})
    .then(user => {
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const horoscope = [
            {name: "Neptune",current_sign:"Pisces",fullDegree:234,isRetro:false},
            {name: "Venus",current_sign: "Cancer",fullDegree:120,isRetro:true},
            ];
        res.json(horoscope);
    })
    .catch(error => {
        console.error("Error fetching horoscope",error);
        res.status(500).json({message:"Error fetching horoscope data"});
    });
});
// Start the server
app.listen(8001, () => {
  console.log(`Server running on http://143.198.79.177:8001/`);
});
