document.getElementById("user_info").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    // Get form data
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const data = {
      username,
      name,
      email
    };
  
    // send post req
    fetch("http://localhost:8001/user_info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Check if userId is returned correctly
        if (data.message === "User found") {
            // Save data to localStorage
            localStorage.setItem("userData", JSON.stringify(data.user));
            localStorage.setItem("userId", data.user.userId);
            window.location.href = "main_page.html";
        } else {
            alert(data.message || "No user found with  given credentials.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error processing your request.");
    });
});