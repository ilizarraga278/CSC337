// random responses, will change when emily pushes code
const eightBallFortunes = [
    "Yes, definitely!",
    "It will be okay.",
    "AHHHH idk idk, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Not very demure.",
    "Bad Bunny says yes",
    "Take a break, go get a sweet treat!! :) "
];

// event listener for submit
document.getElementById("submitQuestion").addEventListener("click", function () {
    const userQuestion = document.getElementById("userQuestion").value;

    // did they enter a question?
    if (!userQuestion.trim()) {
        alert("Please enter a question before submitting! :)");
        return;
    }

    // random fortune - will change depending on emilys code
    const randomIndex = Math.floor(Math.random() * eightBallFortunes.length);
    const randomFortune = eightBallFortunes[randomIndex];

    // actualyl displaying random fortune
    const fortuneBox = document.getElementById("fortuneGiven");
    fortuneBox.textContent = randomFortune;

    // clearing input field so they can type again
    document.getElementById("userQuestion").value = "";
});