const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./database/velox_subscribers.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            unsubscribe_token TEXT UNIQUE
        )
    `;
    
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Subscribers table ready');
        }
    });
}

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Validation middleware
const validateSubscription = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes
app.post('/api/subscribe', validateSubscription, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email } = req.body;

        // Check if email already exists
        db.get('SELECT id FROM subscribers WHERE email = ?', [email], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error occurred'
                });
            }

            if (row) {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already subscribed'
                });
            }

            // Generate unsubscribe token
            const unsubscribeToken = require('crypto').randomBytes(32).toString('hex');

            // Insert new subscriber
            const insertSQL = `
                INSERT INTO subscribers (name, email, unsubscribe_token)
                VALUES (?, ?, ?)
            `;
            
            db.run(insertSQL, [name, email, unsubscribeToken], function(err) {
                if (err) {
                    console.error('Error inserting subscriber:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to subscribe'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Successfully subscribed!',
                    data: {
                        id: this.lastID,
                        name,
                        email,
                        subscribed_at: new Date().toISOString()
                    }
                });
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get all subscribers (admin endpoint)
app.get('/api/subscribers', (req, res) => {
    const query = `
        SELECT id, name, email, subscribed_at, is_active
        FROM subscribers
        ORDER BY subscribed_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch subscribers'
            });
        }

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    });
});

// Unsubscribe endpoint
app.post('/api/unsubscribe', (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Unsubscribe token is required'
        });
    }

    const updateSQL = `
        UPDATE subscribers 
        SET is_active = 0 
        WHERE unsubscribe_token = ? AND is_active = 1
    `;
    
    db.run(updateSQL, [token], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to unsubscribe'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired unsubscribe token'
            });
        }

        res.json({
            success: true,
            message: 'Successfully unsubscribed'
        });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 