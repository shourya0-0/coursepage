import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import nodemailer from 'nodemailer';
import 'dotenv/config'

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 9000;
const corsOptions = {
    origin: '*', // Adjust this to your frontend URL
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Error verifying mail configuration:", error);
    } else {
        console.log("Mail server is ready to send messages");
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Email route
app.post('/api/send-email', async (req, res) => {
    console.log("Attempting to send email...");
    try {
        const { to, subject, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


