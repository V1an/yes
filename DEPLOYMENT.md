# Deployment Guide

## Quick Deploy Options

### 1. Replit (Recommended)
- Import this repository to Replit
- The project is pre-configured with `replit.md` settings
- Click the "Deploy" button in Replit interface
- Your app will be available at `https://yourapp.replit.app`

### 2. Vercel
```bash
npm install -g vercel
vercel
```

### 3. Heroku
```bash
# Install Heroku CLI then:
heroku create your-pedantix-proxy
git push heroku main
```

### 4. Railway
```bash
# Connect your GitHub repo to Railway
# Deploy automatically on push
```

### 5. Digital Ocean App Platform
- Connect your GitHub repository
- Use the following settings:
  - Build Command: `npm run build`
  - Run Command: `npm start`
  - Port: 5000

## Environment Configuration

For production deployment, ensure these settings:

```bash
NODE_ENV=production
PORT=5000
```

## Build Process

The application uses Vite for frontend builds:

```bash
# Development
npm run dev

# Production build
npm run build

# Production serve
npm start
```

## Network Requirements

The proxy server needs outbound HTTPS access to:
- `pedantix.certitudes.org` (main game site)
- `static.certitudes.org` (assets)
- `fonts.googleapis.com` (Google Fonts)

## Performance Notes

- The proxy handles real-time game requests
- Response times depend on the original site performance
- Consider implementing caching for static assets in production
- The app uses minimal server resources (good for free tier hosting)

## Security Considerations

- The proxy forwards requests to trusted domains only
- CORS headers are properly configured
- No user data is stored or logged
- All game logic remains on the original servers