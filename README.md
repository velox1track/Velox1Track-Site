# Velox 1 - Email Subscription Backend

A complete backend system for managing email subscriptions for the Velox 1 track & field competition website.

## 🚀 Features

- **Email Subscription Management**: Collect and store subscriber information
- **SQLite Database**: Lightweight, file-based database for easy deployment
- **Security**: Rate limiting, input validation, and CORS protection
- **Unsubscribe System**: Secure token-based unsubscribe functionality
- **Admin Endpoints**: View all subscribers and manage the listserv
- **Health Monitoring**: Built-in health check endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5000
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the server**
   ```bash
   npm start
   ```

For development with auto-restart:
```bash
npm run dev
```

## 📊 API Endpoints

### Subscribe to Updates
```http
POST /api/subscribe
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subscribed_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Subscribers (Admin)
```http
GET /api/subscribers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "subscribed_at": "2024-01-15T10:30:00.000Z",
      "is_active": 1
    }
  ],
  "count": 1
}
```

### Unsubscribe
```http
POST /api/unsubscribe
Content-Type: application/json

{
  "token": "unsubscribe_token_here"
}
```

### Health Check
```http
GET /api/health
```

## 🗄️ Database Schema

The system uses SQLite with the following table structure:

```sql
CREATE TABLE subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    unsubscribe_token TEXT UNIQUE
);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5000 |
| `DB_PATH` | Database file path | ./database/velox_subscribers.db |

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Message**: "Too many requests from this IP, please try again later."

## 🛡️ Security Features

- **Input Validation**: Email format and name validation
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Configurable origin restrictions
- **Helmet**: Security headers
- **SQL Injection Protection**: Parameterized queries
- **Unique Email Constraint**: Prevents duplicate subscriptions

## 📁 Project Structure

```
velox-1-backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── database/             # Database files (created automatically)
│   └── velox_subscribers.db
├── scripts/
│   └── init-database.js  # Database initialization script
└── README.md             # This file
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📧 Email Integration

To send actual emails to your subscribers, you can integrate with services like:

- **SendGrid**: `npm install @sendgrid/mail`
- **Mailgun**: `npm install mailgun.js`
- **AWS SES**: `npm install @aws-sdk/client-ses`

Example SendGrid integration:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send newsletter
const msg = {
  to: subscriber.email,
  from: 'noreply@velox1.com',
  subject: 'Velox 1 Updates',
  text: 'Your newsletter content here'
};
sgMail.send(msg);
```

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### View Subscribers
```bash
curl http://localhost:3000/api/subscribers
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in .env file
   PORT=3001
   ```

2. **Database permission errors**
   ```bash
   # Ensure database directory is writable
   chmod 755 database/
   ```

3. **CORS errors**
   ```bash
   # Update FRONTEND_URL in .env
   FRONTEND_URL=http://your-frontend-url.com
   ```

### Logs

The server logs all activities to console. Check for:
- Database connection errors
- Validation failures
- Rate limiting hits

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions, please contact the Velox 1 development team. 