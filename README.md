# Pédantix Proxy

A web-based proxy application that provides unrestricted access to the Pédantix French word game (https://pedantix.certitudes.org/) when blocked by network restrictions !

## Features

- **Full Game Access**: Complete proxy of the original Pédantix game functionality
- **Bypass Network Restrictions**: Access Pédantix even when blocked by corporate/school networks
- **External Asset Proxying**: Handles all external resources (CSS, JS, images) through CORS-enabled proxy
- **API Interception**: Seamless proxy of all game API calls
- **Responsive Design**: Works on desktop and mobile devices
- **French Interface**: Native French language support

## How It Works

The application provides two access methods:

1. **Direct Access**: Opens the original site in a new tab (if accessible)
2. **Proxy Access**: Serves the complete Pédantix game through a proxy server that:
   - Fetches the original HTML content
   - Rewrites all asset URLs to go through the proxy
   - Intercepts and forwards all API calls
   - Adds CORS headers to prevent browser blocking
   - Handles external resources from static.certitudes.org

## Technical Architecture

- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express.js
- **Proxy Engine**: Axios with Cheerio for HTML manipulation
- **Asset Handling**: Dynamic URL rewriting and CORS header injection
- **API Forwarding**: Complete request/response proxying with proper headers

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pedantix-proxy.git
cd pedantix-proxy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Replit Deployment (Recommended)
1. Import the project to Replit
2. The project is pre-configured for Replit deployment
3. Click "Deploy" in the Replit interface

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Set environment variables:
```bash
export NODE_ENV=production
export PORT=5000
```

3. Start the production server:
```bash
npm start
```

## Environment Variables

- `NODE_ENV`: Set to "production" for production deployment
- `PORT`: Server port (default: 5000)

## API Endpoints

- `/`: Main application interface
- `/proxy-game-direct`: Direct proxy of Pédantix game
- `/api-proxy/*`: Proxy for all Pédantix API calls
- `/assets/*`: Proxy for Pédantix assets
- `/external-proxy/*`: Proxy for external resources (static.certitudes.org, etc.)

## Legal Notice

This is an educational proxy application that provides access to the original Pédantix game. All game content and intellectual property belong to the original creators at certitudes.org. This proxy does not modify game content or functionality - it simply provides network access when the original site is blocked.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details