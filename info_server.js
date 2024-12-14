import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = 8001;
const MONGOURL = process.env.MONGO_URL;
const API_URL = 'https://json.freeastrologyapi.com/planets';
const API_KEY = 'VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => console.log("Error connecting to MongoDB:", error));

// User Schema
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    year: Number,
    month: Number,
    day: Number,
    fortunes: { type: [String], default: [] },
});

const UserModel = mongoose.model("users", userSchema);

// Routes for User Management (create, fetch, update)
app.post("/createProfileForm", (req, res) => {
    const { name, username, email, year, month, day } = req.body;
    const newUser = new UserModel({ name, username, email, year, month, day });

    newUser.save()
        .then(() => res.json({ message: "User profile created successfully!" }))
        .catch((error) => res.status(500).json({ message: "Error saving profile." }));
});

app.post("/user_info", (req, res) => {
    const { username, name, email } = req.body;
    UserModel.findOne({ username, name, email }).select('_id name username email year month day fortunes')
        .then(user => {
            if (!user) return res.status(404).json({ message: 'User not found.' });
            res.status(200).json({ message: "User found", user });
        })
        .catch(error => res.status(500).json({ message: 'Error fetching user.' }));
});

app.post("/updateFortune/:userId", (req, res) => {
    const userId = req.params.userId;
    const { fortune } = req.body;

    UserModel.findByIdAndUpdate(userId, { $push: { fortunes: fortune } }, { new: true })
        .then(updatedUser => {
            if (!updatedUser) return res.status(404).json({ message: "User not found." });
            res.json({ message: "Fortune updated successfully.", fortunes: updatedUser.fortunes });
        })
        .catch(error => res.status(500).json({ message: "Error updating fortune." }));
});

// Get all users' data
app.get("/all_users", (req, res) => {
    UserModel.find().select('username name email fortunes')
        .then(users => {
            if (!users || users.length === 0) return res.status(404).json({ message: 'No users found.' });
            res.status(200).json(users);
        })
        .catch(error => res.status(500).json({ message: 'Error fetching users.' }));
});

// Astrology API route
app.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find();
        const user = users[0];
        
        if (!user) return res.status(404).json({ message: "User not found" });
        const { year, month, day } = user;
        const currentTime = new Date();
        const requestData = {
          year: user.year,
          month: user.month,
          date: user.day,
          hours: currentTime.getHours(),
          minutes: currentTime.getMinutes(),
          seconds: currentTime.getSeconds(),
          latitude: 32.2319,
          longitude: -110.9501,
          timezone: -7.0,
          settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri"
          }
        };

        const response = await axios.post(API_URL, requestData, {
          headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
          },
      });

        const apiData = response.data.output.map(entry => {
            // Dynamically access the key corresponding to the user's month (e.g., "7" for July)
            const planetData = entry[month];
            if (planetData) {
                return {
                    name: planetData.name,
                    current_sign: planetData.current_sign,
                    fullDegree: planetData.fullDegree,
                    isRetro: planetData.isRetro,
                };
            }
            return null; // If there's no matching data, return null
        }).filter(Boolean); // Filter out any null entries

        res.status(200).json(apiData);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to fetch data from Astrology API" });
    }
});

// Serve the welcome page (or other static pages)
app.get("/", (req, res) => {
    res.sendFile('welcome_page.html');
});

// import express from"express";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import cors from "cors";

// const app = express();

// const PORT = 8001
// const MONGO_URL = "mongodb://127.0.0.1:27017/FinalProject"

// // Middleware
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
// }));

// app.use(bodyParser.json());

// //Connect to MongoDB
// mongoose.connect(MONGO_URL).then(() => {
//   console.log("Database is connected successfully.");
// }).catch((error) => console.log(error));
// // User Schema
// const userSchema = mongoose.Schema({
//     name: String,
//     username: String,
//     email: String,
//     year: Number,
//     month: Number,
//     day: Number,
//     fortunes: { type: [String], default: [] }, // Empty array initialized by default
//   });

// // Create Mongoose model
// const UserModel = mongoose.model("users", userSchema);

// app.get("/",(req,res)=>{
//   res.sendFile('welcome_page.html');
// });

// // POST endpoint to create a user profile
// app.post("/createProfileForm", (req, res) => {
//     const { name, username, email, year, month, day } = req.body;

//     // Create a new User instance with an empty fortunes array by default
//     const newUser = new UserModel({
//       name,
//       username,
//       email,
//       year,
//       month,
//       day,
//       fortunes: [] // Explicitly initializing an empty array, though it's already the default
//     });

//   // Save the user data to the database
//   newUser
//     .save()
//     .then(() => {
//       res.json({ message: "User profile created successfully!" });
//     })
//     .catch((error) => {
//       console.error("Error saving user profile:", error);
//       res.status(500).json({ message: "There was an error saving the profile." });
//     });
// });

// app.post("/user_info", (req, res) => {
//   const { username, name, email } = req.body;
  
//   // Search for the user in MongoDB with the provided credentials
//   UserModel.findOne({ username, name, email })
//       .select('_id name username email year month day fortunes')  
//       .then(user => {
//           if (!user) {
//               return res.status(404).json({ message: 'No user found with the given credentials.' });
//           }

//           // If the user is found, return all associated data
//           res.status(200).json({
//               message: "User found",
//               user: {
//                   userId: user._id.toString(),
//                   name: user.name,
//                   username: user.username,
//                   email: user.email,
//                   year: user.year,
//                   month: user.month,
//                   day: user.day,
//                   fortunes: user.fortunes  // Include the user's fortunes as well
//               }
              
//           });

//       })
//       .catch(error => {
//           console.error('Error fetching user:', error);
//           res.status(500).json({ message: 'There was an error fetching the user.' });
//       });
// });

// // POST endpoint to update the user's fortunes
// app.post("/updateFortune/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const { fortune } = req.body;

//   // Update the user's fortunes array by pushing the new fortune
//   UserModel.findByIdAndUpdate(
//       userId,
//       { $push: { fortunes: fortune } }, // Add the new fortune to the fortunes array
//       { new: true } // Return the updated user object
//   )
//   .then(updatedUser => {
//       if (!updatedUser) {
//           return res.status(404).json({ message: "User not found." });
//       }
//       res.json({ message: "Fortune updated successfully.", fortunes: updatedUser.fortunes });
//   })
//   .catch(error => {
//       console.error("Error updating fortune:", error);
//       res.status(500).json({ message: "There was an error updating the fortune." });
//   });
// });

// //  get all users and their latest fortunes
// // POST endpoint to get all users' fortunes (update the endpoint name accordingly)
// app.get("/all_users", (req, res) => {
//   UserModel.find() // Fetch all users from the database
//       .select('username name email fortunes') // Limit the fields to be returned
//       .then(users => {
//           if (!users || users.length === 0) {
//               return res.status(404).json({ message: 'No users found.' });
//           }

//           // Return all users
//           res.status(200).json(users);
//       })
//       .catch(error => {
//           console.error('Error fetching users:', error);
//           res.status(500).json({ message: 'There was an error fetching users.' });
//       });
// });




// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
