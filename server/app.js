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
app.use(cors());
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

