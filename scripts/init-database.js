const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Created database directory');
}

const dbPath = path.join(dbDir, 'velox_subscribers.db');
const db = new sqlite3.Database(dbPath);

console.log('Initializing Velox 1 Subscribers Database...');

// Create subscribers table
const createSubscribersTable = `
    CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        unsubscribe_token TEXT UNIQUE
    )
`;

// Create indexes for better performance
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email)',
    'CREATE INDEX IF NOT EXISTS idx_subscribed_at ON subscribers(subscribed_at)',
    'CREATE INDEX IF NOT EXISTS idx_is_active ON subscribers(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_unsubscribe_token ON subscribers(unsubscribe_token)'
];

db.serialize(() => {
    // Create table
    db.run(createSubscribersTable, (err) => {
        if (err) {
            console.error('Error creating subscribers table:', err.message);
        } else {
            console.log('✓ Subscribers table created successfully');
        }
    });

    // Create indexes
    createIndexes.forEach((indexSQL, i) => {
        db.run(indexSQL, (err) => {
            if (err) {
                console.error(`Error creating index ${i + 1}:`, err.message);
            } else {
                console.log(`✓ Index ${i + 1} created successfully`);
            }
        });
    });

    // Insert sample data (optional)
    const sampleData = [
        ['John Doe', 'john.doe@example.com'],
        ['Jane Smith', 'jane.smith@example.com'],
        ['Mike Johnson', 'mike.johnson@example.com']
    ];

    const insertSampleData = `
        INSERT OR IGNORE INTO subscribers (name, email, unsubscribe_token)
        VALUES (?, ?, ?)
    `;

    sampleData.forEach(([name, email]) => {
        const token = require('crypto').randomBytes(32).toString('hex');
        db.run(insertSampleData, [name, email, token], function(err) {
            if (err) {
                console.error('Error inserting sample data:', err.message);
            } else if (this.changes > 0) {
                console.log(`✓ Added sample subscriber: ${name}`);
            }
        });
    });

    // Verify table structure
    db.get("PRAGMA table_info(subscribers)", (err, rows) => {
        if (err) {
            console.error('Error checking table structure:', err.message);
        } else {
            console.log('\n✓ Database initialization complete!');
            console.log('Database file location:', dbPath);
        }
    });
});

// Close database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('✓ Database connection closed');
        console.log('\n🎉 Database setup complete!');
        console.log('You can now start the server with: npm start');
    }
}); 