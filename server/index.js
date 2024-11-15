require('dotenv').config();
console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');  // Pindahkan setelah app di definisikan
const progressRoutes = require('./routes/progressRoutes');

// Connect Database
connectDB();

// Middleware
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://k3rlyn.github.io/web_MyPhysicsLab/', 
        'https://railway.app/project/6e271b85-0627-4880-a600-0feaf35767f3'

    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test route
app.get('/', (req, res) => {
    res.send('API Running');
});

//Use routes
app.use('/api/auth', authRoutes);  
app.use('/api/progress', progressRoutes);  

// Server-Sent Events for real-time updates
app.get('/api/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = () => {
        const data = JSON.stringify({
            timestamp: Date.now(),
            message: 'This is a real-time update from the server'
        });
        res.write(`data: ${data}\n\n`);
    };

    const intervalId = setInterval(sendUpdate, 5000);

    req.on('close', () => {
        clearInterval(intervalId);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;