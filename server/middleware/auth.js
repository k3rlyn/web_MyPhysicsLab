const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);

    try {
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            throw new Error('No Authorization header');
        }

        // Ambil token dari header Authorization
        const token = authHeader.replace('Bearer ', '');
        console.log('Token:', token);

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Verifikasi token
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Pastikan ini ada
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        req.user = { id: decoded.id }; // Menyimpan data pengguna di req.user
        next(); // Melanjutkan ke middleware berikutnya
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ message: 'Please authenticate', error: error.message });
    }
};

module.exports = auth;