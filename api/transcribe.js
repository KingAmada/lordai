import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Multer configuration for handling 'multipart/form-data'
const upload = multer({ storage: multer.memoryStorage() });

export default function handler(req, res) {
    // Apply multer middleware to process the file
    upload.single('audio')(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error processing file');
        }

        if (req.method === 'POST') {
            try {
                const formData = new FormData();
                formData.append('file', req.file.buffer, req.file.originalname);
                formData.append('model', 'whisper-1');

                const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.WHISPER}`,
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
    });
}
