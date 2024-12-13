import mongoose from "mongoose"

//defines journal schema as username:{fortunes with date added}
const JournalSchema = new mongoose.Schema({
    username:{type:String,required: true}, 
    fortunes:[{text:{ String,required: true},date:{type: Date, default:Date.now}}]
});

const JournalModel = mongoose.model('Journal',JournalSchema);
export default JournalModel;

// Retrieve and parse data
const userData = JSON.parse(localStorage.getItem("userData"));

if (userData) {
    console.log("User Data:", userData);
    console.log("Year:", userData.year);
    console.log("Fortunes:", userData.fortunes);

    // Example: Display fortunes on the page
    const fortunesList = document.getElementById("fortunesList");
    userData.fortunes.forEach(fortune => {
        const listItem = document.createElement("li");
        listItem.textContent = fortune;
        fortunesList.appendChild(listItem);
    });
} else {
    console.log("No user data found.");
}
