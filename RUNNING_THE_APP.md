# Running the Application 🚀

## Quick Start

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev:all
```

This will start both the Express backend and Next.js frontend simultaneously.

### Option 2: Run Servers Separately

**Terminal 1 - Express Backend Server:**
```bash
npm run dev:server
```
This starts the Express API server on http://localhost:3001

**Terminal 2 - Next.js Frontend Server:**
```bash
npm run dev
```
This starts the Next.js frontend on http://localhost:3000

## Available Scripts

| Script | Description | Port |
|--------|-------------|------|
| `npm run dev` | Start Next.js frontend | 3000 |
| `npm run dev:server` | Start Express backend | 3001 |
| `npm run dev:all` | Start both servers | 3000 & 3001 |
| `npm run build` | Build Next.js for production | - |
| `npm start` | Start Next.js production server | 3000 |
| `npm run lint` | Run ESLint | - |

## Accessing the Application

Once both servers are running, you can access:

### Frontend (Next.js)
- **Home Page:** http://localhost:3000
- **Register:** http://localhost:3000/register
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard (requires login)

### Backend API (Express)
- **Health Check:** http://localhost:3001/health
- **DB Health:** http://localhost:3001/health/db
- **API Docs:** See server console output for available endpoints

## Verifying Everything Works

### 1. Check if servers are running

```powershell
# Check Next.js (port 3000)
netstat -ano | findstr ":3000"

# Check Express (port 3001)
netstat -ano | findstr ":3001"
```

### 2. Test the backend API

```powershell
curl http://localhost:3001/health
curl http://localhost:3001/health/db
```

### 3. Test the frontend

Open your browser and navigate to:
- http://localhost:3000

You should see the landing page with Login and Register buttons.

### 4. Test the full integration

Run the test script:
```bash
node test-frontend-integration.js
```

## Troubleshooting

### "This site can't be reached" or "Connection refused"

**Problem:** The server isn't running.

**Solution:**
1. Make sure you ran `npm run dev` or `npm run dev:all`
2. Wait a few seconds for the server to start
3. Check if port 3000 is in use: `netstat -ano | findstr ":3000"`

### Port already in use

**Problem:** Another process is using port 3000 or 3001.

**Solution:**
```powershell
# Find the process using the port
netstat -ano | findstr ":3000"

# Kill the process (replace PID with the actual process ID)
Stop-Process -Id PID -Force
```

### Database connection errors

**Problem:** Express server can't connect to MySQL.

**Solution:**
1. Make sure MAMP is running
2. Verify MySQL is running on port 8889
3. Check `.env` file has correct database credentials
4. Test database connection: `node test-db-connection.js`

### Frontend can't connect to backend

**Problem:** Next.js API routes can't reach Express server.

**Solution:**
1. Make sure Express server is running on port 3001
2. Check `.env` file has `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. Restart Next.js dev server after changing `.env`

### Changes not reflecting

**Problem:** Code changes aren't showing up.

**Solution:**
- Both servers have hot-reload enabled
- For Next.js: Changes should reflect automatically
- For Express: ts-node-dev will restart automatically
- If issues persist, stop and restart the servers

## Development Workflow

### Making Changes

1. **Frontend changes** (components, pages):
   - Edit files in `app/`, `components/`, or `lib/`
   - Next.js will hot-reload automatically
   - Refresh browser to see changes

2. **Backend changes** (API routes, database):
   - Edit files in `server/` or `lib/db/`
   - ts-node-dev will restart the server automatically
   - Test with curl or test scripts

3. **Database schema changes**:
   - Update SQL files in `scripts/`
   - Run the migration manually in MySQL
   - Update TypeScript types in `lib/db/types.ts`

### Testing

```bash
# Test backend API
node test-auth.js

# Test frontend integration
node test-frontend-integration.js

# Test database connection
node test-db-connection.js

# Test new user registration
node test-new-user.js
```

## Production Deployment

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

**Note:** For production, you'll need to:
1. Set up a production MySQL database
2. Update environment variables
3. Configure proper CORS settings
4. Set up HTTPS
5. Use a process manager like PM2 for the Express server

## Environment Variables

Make sure your `.env` file contains:

```env
# Database
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=user_profile_service

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=3001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Common Commands

```bash
# Install dependencies
npm install

# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Review the troubleshooting section above
3. Check the documentation files:
   - `DATABASE_README.md` - Database setup
   - `DATABASE_CONNECTION_SETUP.md` - Database connection
   - `FRONTEND_INTEGRATION.md` - Frontend integration
   - `MYSQL_SETUP.md` - MySQL configuration

## Current Status

✅ Database set up (MySQL via MAMP)
✅ Express backend server running
✅ Next.js frontend server running
✅ Authentication routes connected
✅ Frontend forms integrated with backend

Ready to test at http://localhost:3000! 🎉

## running migration
.\scripts\setup-mamp-db.bat

## running test
npm test

