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

// Registration route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email and phone are required' });
        }

        // Generate a unique registration ID
        const registrationId = new mongoose.Types.ObjectId().toString();

        // Create user registration in database without sending email
        const newRegistration = await Email.create({
            name,
            phone,
            to: email,
            subject: 'Registration Confirmation',
            message: 'Thank you for registering',
            registrationId,
            paymentStatus: 'pending'
        });
        
        res.status(201).json({ 
            message: 'Registration successful', 
            registration: newRegistration 
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Failed to register', 
            details: error.message 
        });
    }
});

// Payment success route
app.post('/api/payment-success', async (req, res) => {
    try {
        const { registrationId } = req.body;

        if (!registrationId) {
            return res.status(400).json({ error: 'Registration ID is required' });
        }

        // Find and update the registration using registrationId field
        const registration = await Email.findOne({ registrationId });
        
        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Update payment status
        registration.paymentStatus = 'completed';
        await registration.save();

        // Now send the confirmation email
        const webinarDetails = {
            time: "3:00 PM",
            date: "May 15, 2025",
            link: "https://zoom.us/j/123456789"
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registration.to,
            subject: registration.subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2c3e50;">Thanks for Registering!</h2>
                <p>Hello ${registration.name},</p>
                <p>Your payment has been confirmed and you are now registered for our upcoming webinar.</p>
                <ul>
                    <li><strong>Date:</strong> ${webinarDetails.date}</li>
                    <li><strong>Time:</strong> ${webinarDetails.time}</li>
                    <li><strong>Join Link:</strong> <a href="${webinarDetails.link}">${webinarDetails.link}</a></li>
                </ul>
                <p>IndieGuru Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: 'Payment confirmed and confirmation email sent',
            registration: registration
        });

    } catch (error) {
        console.error('Payment success handling error:', error);
        res.status(500).json({ 
            error: 'Failed to process payment success', 
            details: error.message 
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


