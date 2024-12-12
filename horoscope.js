
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json()); // To parse JSON request bodies

const API_URL = 'https://json.freeastrologyapi.com/planets';
const API_KEY = 'VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY';

app.post('/get-planets', async (req, res) => {
    try {
        // Data payload received from the client
        const userInput = req.body;

        // API request to Free Astrology API
        const response = await axios.post(
            API_URL,
            userInput,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                }
            }
        );

        const api_data = Object.values(response.data.output[1]).map(planet => ({
            name: planet.name,
            isRetro: planet.isRetro,
            current_sign: planet.current_sign
        }));
        console.log(api_data);


        // Send the API response back to the client
        res.status(200).json(api_data);
    } catch (error) {
        console.error('Error calling Astrology API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from Astrology API' });
    }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const cookie_fortunes = [
    "A dream you have will come true.",
    "Our deeds determine us, as much as we determine our deeds.",
    "Never give up. You're not a failure if you don't give up.",
    "You will become great if you believe in yourself.",
    "There is no greater pleasure than seeing your loved ones prosper.",
    "You will marry your lover.",
    "A very attractive person has a message for you.",
    "You already know the answer to the questions lingering inside your head.",
    "It is now, and in this world, that we must live.",
    "You must try, or hate yourself for not trying.",
    "You can make your own happiness.",
    "The greatest risk is not taking one.",
    "The love of your life is stepping into your planet this summer.",
    "Love can last a lifetime, if you want it to.",
    "Now is the time to try something new.",
    "Wealth awaits you very soon.",
    "If you feel you are right, stand firmly by your convictions.",
    "If winter comes, can spring be far behind?",
    "Keep your eye out for someone special.",
    "You are very talented in many ways.",
    "A stranger, is a friend you have not spoken to yet.",
    "A new voyage will fill your life with untold memories.",
    "You will travel to many exotic places in your lifetime.",
    "Your ability for accomplishment will follow with success."
];


let rand_index = Math.floor(Math.random() * cookie_fortunes.length)

//console.log(cookie_fortunes[rand_index])

//API key: VxoTp0ql6W7qD1Ds64U5p6iWvgK1F8KE6YKehJKY
