const express = require('express');
const path = require('path');
const bmiRoutes = require('./routes/bmiRoutes');
const logger = require('./middleware/logger');


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Custom middleware (logger)
app.use(logger);


// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));


// API routes
app.use('/api/bmi', bmiRoutes);


// Basic home route (served by static index.html, but keep a fallback)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});