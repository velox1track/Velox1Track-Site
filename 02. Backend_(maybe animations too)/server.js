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

// Enhanced security configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});

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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
});

// Specific rate limiting for admin endpoints
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs for admin
    message: 'Too many admin requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);
app.use('/admin', adminLimiter);

// Simple authentication middleware for admin panel
const adminAuth = (req, res, next) => {
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken) {
        console.warn('ADMIN_TOKEN not set in environment variables');
        return res.status(500).json({ error: 'Admin authentication not configured' });
    }
    
    const providedToken = req.headers['x-admin-token'] || req.query.token;
    
    if (!providedToken || providedToken !== adminToken) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    next();
};

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

// Secure admin API endpoint
app.get('/api/admin/subscribers', adminAuth, (req, res) => {
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