document.getElementById("createProfileForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
  
    // Get form data
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;
  
    const fortunes = [];
  
    const data = {
      name,
      username, 
      email,
      year,
      month,
      day,
      fortunes,
    };

    // Save the user profile data into localStorage
    localStorage.setItem("userData", JSON.stringify(data));

    // Send a POST request to the backend
    fetch("http://localhost:8001/createProfileForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        console.log('Server response:', data); // Check the response data

        if (data.message === "User profile created successfully!") {
            // Save data to localStorage
            localStorage.setItem("userId", data.user.userId);

            window.location.href = "main_page.html";
        } else {
            alert('User not found or other error occurred.');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error occurred while creating the user profile.");
    });
});
