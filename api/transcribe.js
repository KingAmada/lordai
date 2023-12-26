import fetch from 'node-fetch';
import FormData from 'form-data';

async function callWhisperAPI(audioBlob) {
    try {
        const url = 'https://api.openai.com/v1/audio/transcriptions';
        const formData = new FormData();

        // Append the audio data as a blob
        formData.append('file', audioBlob, "audio.mp4");
        formData.append('model', 'whisper-1');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHISPER}`
                // FormData will set the Content-Type to 'multipart/form-data'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error from Whisper API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error calling Whisper API:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Assuming the audio data is received as a blob in the request body
        const audioBlob = req.body; 

        try {
            const transcribedText = await callWhisperAPI(audioBlob);
            res.status(200).json({ text: transcribedText });
        } catch (error) {
            console.error('Error in transcribe function:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}




