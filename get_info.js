// Add an event listener to the form to handle the submission
document.getElementById("createProfileForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect the data entered in the form fields
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;

    // Create an object to send as the request body
    const data = {
        name,
        username,
        email,
        birthdate: { year, month, day }
    };

    // Send the data to the backend 
    fetch("/createProfileForm", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json" // Send JSON data
        },
        body: JSON.stringify(data) // Convert the data object to a JSON string
    })
    .then(response => {
        if (response.ok) {
            // Redirect the user to the welcome page if registration successful 
            window.location.href = "/main_page.html";
        } else {
            return response.json(); // Parse the response as JSON if there's an error
        }
    })
    .then(data => {
        if (data && data.message) {
            // Handle any error messages returned from the server
            alert(data.message);
        }
    })
    .catch(error => {
        // Log and display any errors that occur
        console.error("Error:", error);
        alert("There was an error submitting the form.");
    });
});