document.getElementById("user_info").addEventListener("loginButton", function(event) {
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
        // send response messages
        alert(data.message || "Welcome Back!");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error logging in.");
    });
  });