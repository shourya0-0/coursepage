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
        const { to, subject, message, name, phone } = req.body;

        if (!to || !subject ||!name ||!phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const webinarDetails = {
            time: "3:00 PM", // Hardcoded time
            date: "May 15, 2025", // Hardcoded date
            link: "https://zoom.us/j/123456789" // Hardcoded link
        };

        console.log('working fine')
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        message: `Thanks for registering for our webinar!\nDate: ${webinarDetails.date}\nTime: ${webinarDetails.time}\nJoin Link: ${webinarDetails.link}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2c3e50;">Thanks for Registering!</h2>
            <p>Hello ${name},</p>
            <p>You are confirmed for our upcoming webinar.</p>
            <ul>
                <li><strong>Date:</strong> ${webinarDetails.date}</li>
                <li><strong>Time:</strong> ${webinarDetails.time}</li>
                <li><strong>Join Link:</strong> <a href="${webinarDetails.link}">${webinarDetails.link}</a></li>
            </ul>
            <p>IndieGuru Team</p>
            </div>
        `
        };

        const info = await transporter.sendMail(mailOptions);

        // Save email record to MongoDB
        await Email.create({
            name,
            phone, // You can extract phone from the body if it's passed
            to,
            subject,
            message,
            status: 'success'
        });

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


