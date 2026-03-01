const crypto = require('crypto');

console.log('=== SECURE TOKEN GENERATOR ===');
console.log('');

// Generate admin token
const adminToken = crypto.randomBytes(32).toString('hex');
console.log('ADMIN_TOKEN=' + adminToken);

// Generate session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);

console.log('');
console.log('=== INSTRUCTIONS ===');
console.log('1. Copy these values to your .env file');
console.log('2. Never share these tokens with anyone');
console.log('3. Keep your .env file secure and never commit it to git'); 