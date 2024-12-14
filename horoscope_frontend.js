window.onload = function() {

    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://143.198.79.177:8001/getUsers', true);  // Replace with your actual server URL


    xhr.onload = function() {

        if (xhr.status === 200){
            const data = JSON.parse(xhr.responseText);
            console.log('API Data:', data);
            displayHoroscope(data);
        }
        else {
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

    data.forEach(entry => {
        const planetElement = document.createElement('div');
        planetElement.innerHTML = `
            <p>Name: ${entry.name}</p>
            <p>Current Sign: ${entry.current_sign}</p>
            <p>Full Degree: ${entry.fullDegree}</p>
            <p>Retrograde: ${entry.isRetro}</p>
        `;
        horoscopeContainer.append(planetElement)
    })
}
document.addEventListener("DOMContentLoaded", () => {
    // Get user's birthdate data (e.g., from form inputs)
    const year = 1990;
    const month = 7; // For July
    const day = 15;

    // Make a request to the server
    fetch(`http://143.198.79.177:8001/getHoroscope?year=${year}&month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {
            // Display the returned data
            const horoscopeContainer = document.getElementById('horoscopeGiven');
            horoscopeContainer.innerHTML = '';

            data.forEach(entry => {
                const planetInfo = `
                    <div>
                        <h2>${entry.name}</h2>
                        <p>Current Sign: ${entry.current_sign}</p>
                        <p>Full Degree: ${entry.fullDegree}</p>
                        <p>Is Retrograde: ${entry.isRetro === 'true' ? 'Yes' : 'No'}</p>
                    </div>
                `;
                horoscopeContainer.innerHTML += planetInfo;
            });
        })
        .catch(error => {
            console.error("Error fetching horoscope data:", error);
            document.getElementById('horoscopeGiven').innerHTML = 'Loading horoscope data... <br> Please wait 5 seconds then reload';

        });
});

