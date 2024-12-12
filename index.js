// import express from "express"
// import mongoose from "mongoose"
// import dotenv from "dotenv"

// const app = express();

// dotenv.config();

// const PORT = process.env.PORT || 7000
// const MONGOURL = process.env.MONGO_URL;

// // Connect to MongoDB and start the server
// mongoose.connect(MONGOURL).then(() => {
//     console.log("Database connected successfully.");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   });
  
//   const userSchema = mongoose.Schema({
//     name: String,
//     year: Number
//   });
  
//   // Create a Mongoose model called "UserModel" based on the userSchema
//   const UserModel = mongoose.model("users", userSchema);
  
//   // Set up a route in the Express application to handle GET requests to "/getUsers"
//   app.get("/getUsers", async (req, res) => {
//     // Await fetching all user data from the database using the UserModel
//     const users = await UserModel.find();
//     // Send the user data as a JSON response
//     res.json(users);
//   });

