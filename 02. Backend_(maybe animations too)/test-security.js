const http = require('http');

console.log('🔒 SECURITY TEST SCRIPT');
console.log('========================');
console.log('');

// Test 1: Check if admin panel is accessible without authentication
console.log('Test 1: Checking admin panel access...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/admin',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
        console.log('❌ VULNERABLE: Admin panel accessible without authentication!');
        console.log('   Anyone can see your subscriber data.');
    } else {
        console.log('✅ SECURE: Admin panel requires authentication.');
    }
    
    console.log('');
    console.log('Next steps:');
    console.log('1. Follow the SECURITY-SETUP.md guide');
    console.log('2. Set up your .env file with secure tokens');
    console.log('3. Restart your server and test again');
});

req.on('error', (e) => {
    console.log('❌ Error: Make sure your server is running (npm start)');
    console.log('   Then run this test again.');
});

req.end();

console.log('Running security test...');
console.log('(Make sure your server is running with: npm start)'); 