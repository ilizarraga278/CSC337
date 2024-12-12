const openCookieButton = document.getElementById("openCookie");
const fortuneGiven = document.getElementById("fortuneGiven");
const cookieImage = document.getElementById("cookieImage");

// random fortuens
const fortunes = [
    "You will have a great day!",
    "Success is in your future.",
    "Good news is coming your way.",
    "An exciting opportunity lies ahead.",
    "Happiness is yours to take.",
    "A surprise gift awaits you."
];

// button for opening cookies
openCookieButton.addEventListener("click", () => {
    // replacing image with the open one
    cookieImage.src = "Images/opencookie.png";

    // random fortune
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    // showing fortune
    fortuneGiven.textContent = randomFortune;

});
