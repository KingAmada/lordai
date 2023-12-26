
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
        const url = 'https://api.openai.com/v1/audio/transcriptions'; // Ensure this is correct
        console.log('Sending request to Whisper API'); // Additional logging

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'audio/mp4', // Adjust based on your audio file's format
                'Authorization': `Bearer ${process.env.WHISPER}` // Ensure API key is correct
            },
            body: audioData
        });

        if (!response.ok) {
            console.error(`Response from Whisper API: ${response.status} ${response.statusText}`);
            throw new Error(`Error from Whisper API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error calling Whisper API:', error);
        throw error;
    }
}

