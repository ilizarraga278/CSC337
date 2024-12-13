async function displayUserFortunes() {
    try {
        // Fetch all user data from the backend API
        const response = await fetch('http://localhost:8001/all_users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            // Get the container where we will display the user data
            const userFortunesDiv = document.getElementById('user-fortunes');
            userFortunesDiv.innerHTML = ''; // Clear any existing content

            // Iterate through all users and display their data
            data.forEach(user => {
                // Create a container for each user's information
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-container'); // Add a class for styling

                // Add user details
                const nameDiv = document.createElement('div');
                nameDiv.textContent = `Name: ${user.name}`;
                userDiv.appendChild(nameDiv);

                const usernameDiv = document.createElement('div');
                usernameDiv.textContent = `Username: ${user.username}`;
                userDiv.appendChild(usernameDiv);

                const latestFortune = user.fortunes[user.fortunes.length - 1] || 'No fortune available';
                const fortuneDiv = document.createElement('div');
                fortuneDiv.textContent = `Latest Fortune: ${latestFortune}`;
                userDiv.appendChild(fortuneDiv);

                // Append the user's information to the main container
                userFortunesDiv.appendChild(userDiv);
            });
        } else {
            console.error('Data is not an array:', data);
        }
    } catch (error) {
        console.error('Error fetching user fortunes:', error);
    }
}

document.addEventListener('DOMContentLoaded', displayUserFortunes);
