import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import 'dotenv/config'
import { Email } from './models/Email.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 9000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursespage';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
        
        // Save email record to MongoDB
        await Email.create({
            to,
            subject,
            message,
            status: 'success'
        });

        console.log("Email sent successfully:", info);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        // Save failed email attempt to MongoDB
        await Email.create({
            to: req.body.to,
            subject: req.body.subject,
            message: req.body.message,
            status: 'failed'
        }).catch(err => console.error('Error saving failed email to DB:', err));

        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


