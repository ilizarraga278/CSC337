import express from"express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

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
      fortunes: [], // empty array by default
    });

  // save the user data to the database
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

app.post("/user_info", (req, res) => {
  const { username, name, email } = req.body;
  
  // Search for the user in MongoDB with the provided credentials
  UserModel.findOne({ username, name, email })
      .select('_id name username email year month day fortunes')  
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: 'No user found with the given credentials.' });
          }

          // If the user is found, return all associated data
          res.status(200).json({
              message: "User found",
              user: {
                  userId: user._id.toString(),
                  name: user.name,
                  username: user.username,
                  email: user.email,
                  year: user.year,
                  month: user.month,
                  day: user.day,
                  fortunes: user.fortunes  // Include the user's fortunes as well
              }
              
          });

      })
      .catch(error => {
          console.error('Error fetching user:', error);
          res.status(500).json({ message: 'There was an error fetching the user.' });
      });
});

// POST endpoint to update the user's fortunes
app.post("/updateFortune/:userId", (req, res) => {
  const userId = req.params.userId;
  const { fortune } = req.body;

  // Update the user's fortunes array by pushing the new fortune
  UserModel.findByIdAndUpdate(
      userId,
      { $push: { fortunes: fortune } }, // Add the new fortune to the fortunes array
      { new: true } // Return the updated user object
  )
  .then(updatedUser => {
      if (!updatedUser) {
          return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "Fortune updated successfully.", fortunes: updatedUser.fortunes });
  })
  .catch(error => {
      console.error("Error updating fortune:", error);
      res.status(500).json({ message: "There was an error updating the fortune." });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
