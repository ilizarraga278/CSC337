window.onload = function() {
    const xhr = new XMLHttpRequest();

    //xhr.open('GET', 'http://localhost:8000/getUsers', true);  // Replace with your actual server URL
    xhr.open('GET', 'http://localhost:8001/getUsers', true);  // Replace with your actual server URL

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log('API Data:', data);
            displayHoroscope(data);
        } else {
            console.error('Request failed: ', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request failed');
    };

    xhr.send();
};

function displayHoroscope(data) {
    const horoscopeContainer = document.getElementById('horoscopeGiven');
    horoscopeContainer.innerHTML = '';

    // Check if data is not empty and only display the first element
    if (data.length > 0) {
        const firstEntry = data[0];  // Get the first user from the data

        const planetElement = document.createElement('div');
        planetElement.innerHTML = `
            <p>Name: ${firstEntry.name}</p>
            <p>Current Sign: ${firstEntry.current_sign}</p>
            <p>Full Degree: ${firstEntry.fullDegree}</p>
            <p>Retrograde: ${firstEntry.isRetro}</p>
        `;
        horoscopeContainer.append(planetElement);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Get user's birthdate data (e.g., from form inputs)
    const year = 1990;
    const month = 8; // For July
    const day = 15;

    // Make a request to the server
    fetch(`http://localhost:8001/getHoroscope?year=${year}&month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {
            // Display the returned data
            const horoscopeContainer = document.getElementById('horoscopeGiven');
            horoscopeContainer.innerHTML = '';

            // Display only the first user's horoscope data
            if (data.length > 0) {
                const firstEntry = data[0];

                const planetInfo = `
                    <div>
                        <h2>${firstEntry.name}</h2>
                        <p>Current Sign: ${firstEntry.current_sign}</p>
                        <p>Full Degree: ${firstEntry.fullDegree}</p>
                        <p>Is Retrograde: ${firstEntry.isRetro === 'true' ? 'Yes' : 'No'}</p>
                    </div>
                `;
                horoscopeContainer.innerHTML += planetInfo;
            }
        })
        .catch(error => {
            console.error("Error fetching horoscope data:", error);
            document.getElementById('horoscopeGiven').innerHTML = 'Loading horoscope data... <br> Please wait 5 seconds then reload';
        });
});
