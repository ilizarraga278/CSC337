
// //defines journal schema as username:{fortunes with date added}
// const JournalSchema = new mongoose.Schema({
//     username:{type:String,required: true}, 
//     fortunes:[{text:{ String,required: true},date:{type: Date, default:Date.now}}]
// });

// const JournalModel = mongoose.model('Journal',JournalSchema);
// export default JournalModel;

// // Retrieve and parse data
// const userData = JSON.parse(localStorage.getItem("userData"));

// if (userData) {
//     console.log("User Data:", userData);
//     console.log("Year:", userData.year);
//     console.log("Fortunes:", userData.fortunes);

//     // Example: Display fortunes on the page
//     const fortunesList = document.getElementById("fortunesList");
//     userData.fortunes.forEach(fortune => {
//         const listItem = document.createElement("li");
//         listItem.textContent = fortune;
//         fortunesList.appendChild(listItem);
//     });
// } else {
//     console.log("No user data found.");
// }

// Function to display the fortunes (most recent on top)
function displayFortunes() {
    // Get the user fortunes stored in localStorage using the user ID as the key
    const userId = localStorage.getItem('userId');
    const fortunes = JSON.parse(localStorage.getItem('userFortunes')); // Get the fortunes array from localStorage
    console.log(fortunes[userId])
    // Check if fortunes are available
    if (!fortunes || fortunes.length === 0) {
        console.log("No fortunes found.");
        return;
    }

    const allFortunes = fortunes[userId];
    // Sort the fortunes array in reverse order (most recent on top)
   
    if (!Array.isArray(allFortunes) || allFortunes.length === 0) {
        console.log("Fortunes is not an array or it's empty.");
        return;
    }
    const sortedFortunes = allFortunes.reverse();

    // Get the container to display the fortunes
    const fortuneList = document.getElementById('fortune-list');
    fortuneList.innerHTML = ''; // Clear any existing content

    // Iterate over the sorted fortunes array and display each fortune
    sortedFortunes.forEach(fortune => {
        const fortuneItem = document.createElement('div');
        fortuneItem.classList.add('fortune-item');

        const fortuneText = document.createElement('div');
        fortuneText.classList.add('fortune-text');
        fortuneText.textContent = fortune;

        // Add the fortune item to the list
        fortuneItem.appendChild(fortuneText);
        fortuneList.appendChild(fortuneItem);
    });
}

// Call displayFortunes to update the UI when the page loads
document.addEventListener("DOMContentLoaded", () => {
    displayFortunes();
});
