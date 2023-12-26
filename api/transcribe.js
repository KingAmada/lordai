
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
import FormData from 'form-data';

async function callWhisperAPI(audioFilePath) {
    try {
        const url = 'https://api.openai.com/v1/audio/transcriptions';
        const formData = new FormData();

        formData.append('file', fs.createReadStream(audioFilePath));
        formData.append('model', 'whisper-1');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHISPER}`,
                // 'Content-Type': 'multipart/form-data' is set automatically by FormData
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error from Whisper API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text; // Or adjust based on the actual structure of the response
    } catch (error) {
        console.error('Error calling Whisper API:', error);
        throw error;
    }
}


