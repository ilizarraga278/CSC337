const openCookieButton = document.getElementById("openCookie");
const fortuneGiven = document.getElementById("fortuneGiven");
const cookieImage = document.getElementById("cookieImage");

// Random fortunes for the cookie
const fortunes = [
    "You will have a great day!",
    "Success is in your future.",
    "Good news is coming your way.",
    "An exciting opportunity lies ahead.",
    "Happiness is yours to take.",
    "A surprise gift awaits you."
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

// Button for opening cookies
openCookieButton.addEventListener("click", () => {
    // Replacing image with the open one
    cookieImage.src = "Images/opencookie.png";

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    fortuneGiven.textContent = randomFortune;

    updateFortunes(randomFortune);
});





