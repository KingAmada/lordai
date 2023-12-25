
// pages/api/transcribe.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const audioData = req.body; // Audio data received from the frontend

            // Call the Whisper API (ensure you have proper authentication)
            const transcribedText = await callWhisperAPI(audioData);

            res.status(200).json({ text: transcribedText });
        } catch (error) {
            console.error('Error in transcribe function:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}

import fetch from 'node-fetch';

async function callWhisperAPI(audioData) {
    try {
        const url = 'https://api.openai.com/v1/audio/transcriptions'; // Replace with the actual Whisper API endpoint
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'audio/mp4', // Set the appropriate content type for your audio file
                'Authorization': `Bearer ${process.env.WHISPER_API_KEY}` // Use your Whisper API key from environment variables
            },
            body: audioData // Audio data blob
        });

        if (!response.ok) {
            throw new Error(`Error from Whisper API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text; // Assuming the response contains a 'text' field with the transcribed text
    } catch (error) {
        console.error('Error calling Whisper API:', error);
        throw error; // Rethrow the error for handling upstream
    }
}
fetch('https://lordai.vercel.app/api/transcribe', {
    method: 'POST',
    body: formData
})
.then(response => {
    console.log("Raw response:", response); // Log the raw response
    return response.json();
})
.then(data => {
    // Rest of your code
})
.catch(error => {
    console.error('Error sending audio:', error);
});
