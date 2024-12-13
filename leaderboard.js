document.addEventListener("DOMContentLoaded", async () => {
    const leaderboardBody = document.getElementById("leaderboardBody");

    try {
        // Fetch leaderboard data
        const response = await fetch("/api/leaderboard");
        const users = await response.json();

        // Populate the table
        users.forEach(user => {
            const row = document.createElement("tr");

            const usernameCell = document.createElement("td");
            usernameCell.textContent = user.username;

            const fortunesCell = document.createElement("td");
            fortunesCell.textContent = user.fortunes.join(", ");

            row.appendChild(usernameCell);
            row.appendChild(fortunesCell);

            leaderboardBody.appendChild(row);
        });
    } 
    catch (error) {
        console.error("Error fetching leaderboard data:", error);
        leaderboardBody.innerHTML = `<tr><td colspan="2">Failed to load leaderboard</td></tr>`;
    }
});
