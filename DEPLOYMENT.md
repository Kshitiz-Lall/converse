# DevToolkit Deployment Guide

This guide provides multiple deployment options for your DevToolkit application, from local Docker deployment to cloud platforms. Choose the option that best fits your needs and technical expertise.

## 🏠 Local Docker Deployment (Easiest)

### Prerequisites
- [Docker Desktop](https://docs.docker.com/get-docker/) installed on your machine
- 4GB RAM minimum, 8GB recommended

### Quick Start
1. **Clone and setup:**
   ```bash
   cd c:\My-Repository\converse
   copy .env.example .env
   ```

2. **Configure environment:**
   Edit `.env` file with your settings (especially change default passwords)

3. **Run deployment script:**
   - **Windows:** Double-click `deploy.bat` or run in PowerShell
   - **Mac/Linux:** Run `./deploy.sh` in terminal

4. **Access your application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health

### Manual Docker Commands
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Clean up everything
docker compose down -v --remove-orphans
```

## ☁️ Cloud Deployment Options

### Option 1: Railway (Recommended for Beginners)

**Why Railway?**
- Free tier available
- Automatic deployments from GitHub
- Built-in database hosting
- No Docker knowledge required

**Steps:**
1. **Prepare your code:**
   ```bash
   # Make sure your code is pushed to GitHub
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Deploy Backend:**
   - Visit [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder
   - Set environment variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your-secret-key-here
     OPENAI_API_KEY=your-openai-key
     ```
   - Railway will provide a MongoDB database automatically

3. **Deploy Frontend:**
   - Create another Railway service
   - Choose the `frontend` folder
   - Set environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

4. **Update CORS:**
   Update your backend's CORS settings to allow your frontend domain.

### Option 2: Render.com (Free Tier Available)

**Steps:**
1. **Prepare repository:**
   Make sure `render.yaml` is in your root directory (already created)

2. **Deploy:**
   - Visit [render.com](https://render.com)
   - Connect your GitHub account
   - Choose "Blueprint" deployment
   - Select your repository
   - Render will automatically deploy both services

3. **Configure environment:**
   Set environment variables in Render dashboard as needed.

### Option 3: Vercel + Railway (Frontend/Backend Split)

**For Frontend (Vercel):**
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Set build command: `cd frontend && npm run build`
5. Set output directory: `frontend/dist`
6. Add environment variable: `VITE_API_URL=your-backend-url`

**For Backend (Railway):**
Follow Railway backend steps from Option 1.

### Option 4: DigitalOcean App Platform

1. **Create DigitalOcean account**
2. **Create new App:**
   - Choose GitHub repository
   - Configure services:
     - **Backend Service:**
       - Build command: `cd backend && npm run build`
       - Run command: `cd backend && npm start`
     - **Frontend Service:**
       - Build command: `cd frontend && npm run build`
       - Output directory: `frontend/dist`
3. **Add managed database (MongoDB)**
4. **Configure environment variables**

## 🔧 Environment Variables Guide

### Backend Required Variables
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://username:password@host:port/database
JWT_SECRET=your-very-long-random-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Backend Optional Variables
```bash
OPENAI_API_KEY=your-openai-api-key
REDIS_URL=redis://host:port
MAX_FILE_SIZE=10485760
BCRYPT_ROUNDS=12
```

### Frontend Variables
```bash
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=DevToolkit
VITE_DEBUG_MODE=false
```

## 🛠️ Troubleshooting

### Common Issues

**1. CORS Errors:**
```javascript
// In backend, update CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3001'],
  credentials: true
}));
```

**2. Environment Variables Not Loading:**
- Ensure `.env` file exists and has correct format
- No spaces around `=` in environment variables
- Restart application after changes

**3. Database Connection Issues:**
- Check MongoDB URI format
- Ensure database credentials are correct
- Verify network connectivity

**4. Build Failures:**
- Check Node.js version compatibility (16+ recommended)
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run build`

### Docker Specific Issues

**1. Port Already in Use:**
```bash
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**2. Permission Errors (Linux/Mac):**
```bash
# Make deploy script executable
chmod +x deploy.sh
```

**3. Out of Disk Space:**
```bash
# Clean up Docker resources
docker system prune -a
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS (most cloud providers do this automatically)
- [ ] Set secure CORS origins
- [ ] Review and limit API rate limits
- [ ] Remove debug/development flags
- [ ] Set up monitoring and logging

### Environment Security:
- [ ] Never commit `.env` files to git
- [ ] Use environment variable injection in production
- [ ] Rotate secrets regularly
- [ ] Use read-only database users where possible

## 📊 Monitoring & Maintenance

### Health Checks:
- Backend health endpoint: `/health`
- Check database connectivity
- Monitor error logs
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Backup Strategy:
- Regular database backups
- Store backups in separate location
- Test restore procedures
- Document backup/restore process

## 💰 Cost Estimation

### Free Tier Options:
- **Railway:** 512MB RAM, 1GB disk, $5/month after free credits
- **Render:** 512MB RAM, limited build minutes
- **Vercel:** Unlimited frontend deployments, bandwidth limits
- **DigitalOcean:** $12/month minimum with managed database

### Scaling Considerations:
- Start with free tiers for testing
- Monitor usage and scale as needed
- Consider CDN for frontend assets
- Database optimization for larger datasets

## 🚀 Next Steps

1. **Choose your deployment method** based on your comfort level
2. **Test in development** using Docker locally first
3. **Deploy to staging** environment
4. **Set up monitoring** and alerts
5. **Plan for scaling** as your application grows

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review cloud provider documentation
3. Check application logs for specific errors
4. Ensure all environment variables are set correctly

---

**Pro Tip:** Start with local Docker deployment to test everything works, then move to cloud deployment once you're confident with the setup.