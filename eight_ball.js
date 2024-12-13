// Random responses for the Eight Ball, will change when Emily pushes code
const eightBallFortunes = [
    "Yes, definitely!",
    "It will be okay.",
    "AHHHH idk idk, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Not very demure.",
    "Bad Bunny says yes",
    "You may rely on it",
    "Concentrate and ask again",
    "Very doubtful",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Signs point to yes",
    "Take a break, go get a sweet treat!! :) "
];

// Function to update fortunes on the server
function updateFortunes(fortune) {
    // Get the current user ID (assuming it's stored in a session or retrieved dynamically)
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
    }

    // Send a POST request to the server to update the user's fortunes array
    fetch(`http://localhost:8001/updateFortune/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fortune })
    })
    .then(response => response.json())
    .then(data => {

        // Get stored fortunes from localStorage
        const rawUserFortunes = localStorage.getItem('userFortunes');
        let userFortunes = {};

        // If userFortunes exists in localStorage, parse it
        if (rawUserFortunes !== null) {
            userFortunes = JSON.parse(rawUserFortunes);
        }

        // Ensure the user has a fortune array
        if (!userFortunes[userId]) {
            userFortunes[userId] = [];
        }

        // Add the new fortune
        userFortunes[userId].push(fortune);

        // Save the updated fortunes to localStorage
        localStorage.setItem('userFortunes', JSON.stringify(userFortunes));

    })
    .catch(error => {
        console.error("Error updating fortunes:", error);
    });
}
// Event listener for submit
document.getElementById("submitQuestion").addEventListener("click", function () {
    const userQuestion = document.getElementById("userQuestion").value;

    // Did they enter a question?
    if (!userQuestion.trim()) {
        alert("Please enter a question before submitting! :)");
        return;
    }

    // Random fortune - will change depending on Emily's code
    const randomIndex = Math.floor(Math.random() * eightBallFortunes.length);
    const randomFortune = eightBallFortunes[randomIndex];

    // Actually displaying random fortune
    const fortuneBox = document.getElementById("fortuneGiven");
    fortuneBox.textContent = randomFortune;

    // Clearing input field so they can type again
    document.getElementById("userQuestion").value = "";

    // Call updateFortunes to update the server with the new fortune
    updateFortunes(randomFortune);
});
