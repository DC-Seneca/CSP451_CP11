const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: 'root',
    password: 'password',
    database: 'sampledb'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to get announcements
app.get('/api/announcements', (req, res) => {
    db.query('SELECT * FROM announcements', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
