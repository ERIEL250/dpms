const express = require('express');
const cors = require('cors'); // Import CORS
const { google } = require('googleapis');
const multer = require('multer');
const dotenv = require('dotenv');
const stream = require('stream');
//const path=require("path")
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the frontend
//app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Fallback route for SPA
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
// });

// Enable CORS
app.use(cors());

// Load environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

// Google OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Google Drive API setup
const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [DRIVE_FOLDER_ID],
    };

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    res.status(200).json({ message: 'File uploaded successfully', fileId: driveResponse.data.id });
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error.message);
    res.status(500).send('Error uploading file to Google Drive.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
