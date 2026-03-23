# 🚀 Smart Task App - Quick Start Guide

## Project Overview
A full-stack task management application using Angular 18 frontend + .NET 8 backend with intelligent task prioritization using the Eisenhower Matrix algorithm.

---

## Prerequisites
- **Node.js 18+** and npm 9+ (for Angular frontend)
- **.NET 8 SDK** (for C# backend)
- **SQLite** (included with .NET, no separate installation needed)

---

## Directory Structure
```
smart-task-app-main/
├── SmartTaskApp.Api/          # .NET 8 Backend (ASP.NET Core API)
│   ├── Controllers/            # API endpoints
│   ├── Services/              # Business logic
│   ├── Models/                # Data models
│   ├── Program.cs             # API configuration
│   └── appsettings.json       # Configuration
│
└── SmartTaskUI/               # Angular 18 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── core/          # Services, interceptors
    │   │   ├── features/      # Feature components
    │   │   └── app.routes.ts  # Route configuration
    │   └── environments/      # Environment configs
    ├── package.json           # npm dependencies
    └── angular.json           # Angular configuration
```

---

## Installation & Setup

### Backend Setup (C# / .NET)

1. **Navigate to backend directory**
```bash
cd SmartTaskApp.Api
```

2. **Restore dependencies**
```bash
dotnet restore
```

3. **Build the project**
```bash
dotnet build
```

4. **Run the backend** (runs on http://localhost:5256)
```bash
dotnet run
```

Backend will automatically:
- Create SQLite database (`smarttasks.db`) on first run
- Run database migrations
- Start API server on port 5256

### Frontend Setup (Angular)

1. **Navigate to frontend directory**
```bash
cd SmartTaskUI
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server** (runs on http://localhost:4200)
```bash
npm start
```

4. **Build for production**
```bash
npm run build
```

---

## Application Flow

### 1. Authentication
- User registers with username, email, password
- Backend hashes password using BCrypt
- JWT token issued on successful login
- Token stored in localStorage
- Token sent in Authorization header for all API requests

### 2. Task Management
- **Create Task**: Title, description, importance (1-10), required energy level, due date
- **Smart Prioritization**: Automatic scoring based on:
  - Importance (Eisenhower Matrix)
  - Due date proximity (overdue = +50 points)
  - Required energy level
- **Task Operations**:
  - View all tasks (sorted by smart score)
  - Filter by energy level
  - Mark complete/incomplete
  - Edit task details
  - Delete tasks

### 3. Dashboard
- **Statistics**:
  - Total tasks
  - Pending tasks
  - Completed tasks
  - Completion rate (%)
- **Task List**: Interactive list with smart prioritization
- **Quick Filters**: All, High Energy, Medium Energy, Low Energy

---

## API Endpoints

### Authentication
```
POST   /api/auth/register              → Create new user
POST   /api/auth/login                 → Login and get JWT token
```

### Tasks (All require Authorization header)
```
GET    /api/tasks                      → Get all tasks
GET    /api/tasks?energyFilter=High    → Filter by energy level
POST   /api/tasks                      → Create new task
PUT    /api/tasks/{id}                 → Update task (returns updated task)
PATCH  /api/tasks/{id}/complete        → Toggle completion (returns updated task)
DELETE /api/tasks/{id}                 → Delete task (returns message)
```

---

## Key Features

### ✅ Backend Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: BCrypt encryption
- **Smart Prioritization**: Eisenhower Matrix algorithm
- **Multi-user Support**: Isolated task lists per user
- **CORS Enabled**: Allows Angular frontend requests
- **Error Handling**: Comprehensive API error responses
- **SQLite Database**: Lightweight, zero-config

### ✅ Frontend Features
- **Reactive UI**: Angular Signals & Computed properties
- **Type-Safe**: Full TypeScript with no `any` types
- **Error Handling**: User-friendly error messages & alerts
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive Design**: Tailwind CSS responsive utilities
- **Dark Mode**: Built-in dark theme
- **Auto-logout**: On 401 Unauthorized response

---

## Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=smarttasks.db"
  },
  "Jwt": {
    "Token": "your-secret-key-here"
  }
}
```

### Frontend Configuration (environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5256/api'
};
```

---

## Development Commands

### Frontend
```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Watch mode build
npm run watch
```

### Backend
```bash
# Development
dotnet run

# Watch mode
dotnet watch run

# Build
dotnet build

# Publish
dotnet publish -c Release
```

---

## Testing the Application

### Manual Testing Flow
1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with credentials
3. **Create Task**: Add a task with title, importance, energy level, due date
4. **View Dashboard**: See stats and task list
5. **Filter**: Filter tasks by energy level
6. **Complete Task**: Mark task as done
7. **Delete Task**: Remove a task
8. **Logout**: Sign out and verify redirect to login

### Test Credentials (After First Run)
- Email: `test@example.com`
- Password: `password123`
- Username: `Test User`

---

## Deployment

### Frontend Deployment
1. Build: `npm run build`
2. Output: `dist/smart-task-ui/`
3. Upload to static hosting (Vercel, Netlify, AWS S3, etc.)

### Backend Deployment
1. Publish: `dotnet publish -c Release`
2. Output: `bin/Release/net8.0/publish/`
3. Deploy to server running .NET 8
4. Update JWT secret for production
5. Configure production database (optional)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5256 (backend)
netstat -ano | findstr :5256
taskkill /PID {PID} /F

# Kill process on port 4200 (frontend)
netstat -ano | findstr :4200
taskkill /PID {PID} /F
```

### CORS Errors
- Verify backend CORS allows frontend origin
- Check `Program.cs` for CORS configuration
- Ensure both services are running

### 401 Unauthorized
- Check JWT token is valid
- Verify token is stored in localStorage
- Check Authorization header format: `Bearer {token}`

### Database Locked
- Close all instances of the application
- Delete `smarttasks.db` to reset
- Run backend again (creates new database)

### npm install Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

---

## Performance Tips

### Frontend
- Use production build for optimal performance
- Enable Gzip compression on server
- Use CDN for static assets
- Cache busting with file hashing (Angular default)

### Backend
- Use connection pooling (EF Core default)
- Enable response caching headers
- Implement pagination for large datasets
- Monitor API response times

---

## Security Considerations

- ✅ Passwords hashed with BCrypt
- ✅ JWT tokens with expiration (7 days)
- ✅ HTTPS recommended for production
- ✅ CORS properly configured
- ✅ API validates user ownership of resources
- ✅ Auto-logout on 401 response

**For Production**:
- Change JWT secret to strong random value
- Use HTTPS only
- Set secure cookies
- Implement rate limiting
- Add API logging/monitoring
- Regular security updates

---

## Documentation Links

- [Angular 18 Docs](https://angular.io/docs)
- [.NET 8 Docs](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Authentication](https://jwt.io/introduction)
- [Eisenhower Matrix](https://en.wikipedia.org/wiki/Time_management#Eisenhower_Matrix)

---

## Support & Troubleshooting

### Getting Help
1. Check error messages in browser console (F12)
2. Check backend logs in terminal
3. Verify both services are running
4. Check network tab to inspect API calls
5. Review error handling in services

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| 404 Not Found | Check API endpoint URL in environment.ts |
| 401 Unauthorized | Verify JWT token in localStorage |
| CORS Error | Ensure backend CORS allows frontend origin |
| Database Error | Delete smarttasks.db and restart backend |
| Build Error | Run `npm install` again, clear cache |

---

## Project Status

✅ **Backend**: Optimized, error-free, production-ready
✅ **Frontend**: Optimized, error-free, production-ready
✅ **Integration**: Full API compatibility
✅ **Deployment**: Ready for deployment

---

## Next Steps

1. ✅ Review code changes in BACKEND_FIXES_SUMMARY.md
2. ✅ Review code changes in FRONTEND_FIXES_SUMMARY.md
3. ✅ Run both services locally
4. ✅ Test full user workflow
5. ✅ Deploy to production environment

---

**Version**: 1.0.0
**Last Updated**: March 23, 2026
**Status**: Production Ready ✅

