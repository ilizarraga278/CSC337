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
      // Handle the response (e.g., show a success message)
      alert(data.message || "User profile created successfully!");
  })
  .catch(error => {
      console.error("Error:", error);
      alert("There was an error submitting the form.");
  });
});