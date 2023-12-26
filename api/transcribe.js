import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Multer configuration
const upload = multer({ storage: multer.memoryStorage() });

export default upload.single('audio'), async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const formData = new FormData();
            formData.append('file', req.file.buffer, req.file.originalname);
            formData.append('model', 'whisper-1');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.WHISPER}`,
                    // Content-Type is set automatically by FormData
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error from Whisper API: ${response.statusText}`);
            }

            const data = await response.json();
            res.status(200).json({ text: data.text });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};


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




