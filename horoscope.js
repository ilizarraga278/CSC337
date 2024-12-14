import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// Port and MongoDB connection URL from environment variables
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

const API_URL = 'https://json.freeastrologyapi.com/planets';
const API_KEY = 'VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY';

// Connect to MongoDB and start the server
mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// User Schema
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    year: Number,
    month: Number,
    day: Number,
  });

// Create Mongoose model
const UserModel = mongoose.model("users", userSchema);

// Route to fetch users and make API call using their data
app.get("/getUsers", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find();
        const user = users[0]; // Or filter users based on req.query.name if you want to select specific users
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { year, month, day } = user;

        console.log('Request Data:', { year, month, day });

        // Prepare data for the API call (e.g., astrology data)
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

        // Call the external API using Axios
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

        console.log("Filtered Data based on month:", apiData);

        res.status(200).json(apiData);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to fetch data from Astrology API" });
    }
});



//Correct API CALL
// import express from 'express';
// import axios from 'axios';
// import mongoose from 'mongoose';

// const app = express();
// app.use(express.json()); // To parse JSON request bodies

// const API_URL = 'https://json.freeastrologyapi.com/planets';
// const API_KEY = 'VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY';
// const TUCSON_LAT = 32.2319;
// const TUCSON_LON = -110.9501;
// const TUCSON_TZ = -7.0; // UTC-7 for Tucson

// app.post('/get-planets', async (req, res) => {
//     try {
//         // Data payload received from the client
//         const userInput = req.body;

//         // API request to Free Astrology API
//         const response = await axios.post(
//             API_URL,
//             userInput,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-api-key': API_KEY
//                 }
//             }
//         );

//         const api_data = Object.values(response.data.output[1]).map(planet => ({
//             name: planet.name,
//             isRetro: planet.isRetro,
//             current_sign: planet.current_sign
//         }));
//         console.log(api_data);


//         // Send the API response back to the client
//         res.status(200).json(api_data);
//     } catch (error) {
//         console.error('Error calling Astrology API:', error.message);
//         res.status(500).json({ error: 'Failed to fetch data from Astrology API' });
//     }
// });

// // Start the Express server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
// //API key: VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY
