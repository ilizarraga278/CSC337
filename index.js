import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"


const app = express();
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "CSC337")));
app.use(express.json());  // Middleware to parse JSON body

mongoose.connect(MONGOURL).then(() => {
  console.log("Database is connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => console.log(error));

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

const userModel = mongoose.model("user", userSchema)

// POST route to handle form submission and save data to the database
app.post("/createProfileForm", async (req, res) => {
const { name, username, email, birthdate } = req.body;

try {
  // Check if the username or email already exists in the database
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    return res.status(400).json({ message: "Username or Email already exists!" });
  }

  // Create a new user
  const newUser = new userModel({
    name,
    username,
    email,
    birthdate
  });

      // Save the user to the database
    await newUser.save();
    res.status(201).json({message :"profile created successfully"});
  } catch (error){
      console.error(error);
      res.status(500).send("Server error. Could not create profile.");
  }
  
});