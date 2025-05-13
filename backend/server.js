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
    .then(async () => {
        console.log('Connected to MongoDB');
        // Drop the registrationId index if it exists
        try {
            const collection = mongoose.connection.collection('emails');
            await collection.dropIndex('registrationId_1');
            console.log('Successfully dropped registrationId index');
        } catch (error) {
            // Ignore error if index doesn't exist
            if (!error.message.includes('index not found')) {
                console.error('Error dropping index:', error);
            }
        }
    })
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

        // Create user registration in database without sending email
        const newRegistration = await Email.create({
            name,
            phone,
            to: email,
            subject: 'Registration Confirmation',
            message: 'Thank you for registering',
            paymentStatus: 'pending'
        });

        console.log('New registration:', newRegistration._id);
        res.status(201).json({ 
            message: 'Registration successful', 
            registration: {
                ...newRegistration.toObject(),
                registrationId: newRegistration._id // Use _id as registrationId for frontend compatibility
            }
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

        // Find and update the registration using _id instead of registrationId
        const registration = await Email.findById(registrationId);
        
        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Update payment status
        registration.paymentStatus = 'completed';
        await registration.save();

        // Now send the confirmation email
        const webinarDetails = {
            time: "4:00 - 5:00 PM",
            date: "18th May 2025",
            link: "https://meet.google.com/rdn-bfjt-kri",
            supportContact: "8006335334",
            supportPerson: "Vardan Dhall"
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registration.to,
            subject: "Welcome to IndieGuru's Resume Building Masterclass!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    <h2 style="color: #003265; margin-bottom: 20px;">Hey There,</h2>
                    
                    <p style="margin-bottom: 20px;">Congratulations on taking the first step towards your job search with IndieGuru! 🚀</p>
                    
                    <p style="margin-bottom: 20px;">You're invited to an exclusive Resume Building Masterclass, where you'll learn expert tips to craft a winning resume that could land you your dream job.</p>
                    
                    <div style="background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 10px 0;"><strong>📅 Time:</strong> ${webinarDetails.time}, ${webinarDetails.date}</p>
                        <p style="margin: 10px 0;"><strong>🔗 Join here:</strong> <a href="${webinarDetails.link}" style="color: #003265;">${webinarDetails.link}</a></p>
                    </div>
                    
                    <p style="margin: 20px 0;">In case of any queries or concerns, please reach out to - ${webinarDetails.supportContact} (${webinarDetails.supportPerson})</p>
                    
                    <p style="margin: 20px 0;">We look forward to seeing you there!</p>
                    
                    <p style="margin-top: 30px;">Best Regards,<br>Team IndieGuru</p>
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


