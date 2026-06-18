# Pédantix Proxy Game - Architecture Overview

## Overview

This is a comprehensive web-based proxy application that provides unrestricted access to the Pédantix French word game (https://pedantix.certitudes.org/) when blocked by network restrictions. The application serves as a complete proxy service that intercepts all game functionality, API calls, and external assets, allowing full gameplay even in restricted environments. The system is designed as a full-stack TypeScript application with React frontend, Express proxy backend, and comprehensive asset handling.

## Recent Changes (January 2025)

- ✅ **Complete Proxy Functionality**: Successfully implemented full game proxy with working word submissions
- ✅ **External Asset Handling**: Added comprehensive proxy for all external resources (static.certitudes.org, Google Fonts, etc.)
- ✅ **CORS Resolution**: Implemented proper CORS headers for all proxied resources
- ✅ **API Interception**: Created robust JavaScript interception of all fetch/XHR requests
- ✅ **Production Ready**: Added build scripts, documentation, and deployment guides
- ✅ **GitHub Preparation**: Created README, LICENSE, deployment guides for open source distribution

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with Tailwind CSS styling (shadcn/ui variant)
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for development and production
- **Styling**: Tailwind CSS with custom CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with structured error handling
- **Proxy Integration**: HTTP proxy middleware for external service access
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema validation using Zod
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Session Management**: Session-based game state tracking

## Key Components

### Game Logic Components
- **Game State Management**: Tracks user progress, revealed words, and semantic scores
- **Word Input System**: Handles user word submissions with validation
- **Semantic Matching**: Calculates and displays word similarity scores
- **Article Preview**: Shows partially revealed article content based on guesses

### Proxy Infrastructure
- **External API Integration**: Proxies requests to original Pédantix service
- **Performance Monitoring**: Tracks response times and connection status
- **Error Handling**: Graceful fallback mechanisms for service interruptions

### UI Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Real-time feedback for word submissions
- **Progress Tracking**: Visual indicators for game completion status
- **Statistics Dashboard**: Daily game statistics and user rankings

## Data Flow

### Game Session Flow
1. **Session Initialization**: Generate unique session ID and create game state
2. **Word Submission**: User submits word → validate → calculate semantic score
3. **State Updates**: Update revealed words and game progress in database
4. **Completion Detection**: Monitor for win conditions and trigger completion flow

### Proxy Request Flow
1. **Client Request**: Frontend sends word guess to backend API
2. **External Proxy**: Backend forwards request to original Pédantix service
3. **Response Processing**: Parse semantic scores and article content
4. **State Persistence**: Save updated game state to database
5. **Client Update**: Return processed results to frontend

### Database Schema
- **game_state**: Session tracking with revealed words and progress
- **proxy_stats**: Performance monitoring and service health metrics

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless platform
- **UI Framework**: Radix UI primitives for accessible components
- **HTTP Client**: Axios for external API communications
- **Web Scraping**: Cheerio for HTML parsing when needed

### Development Tools
- **Build System**: Vite with TypeScript compilation
- **Database Management**: Drizzle Kit for migrations and schema management
- **Development Environment**: Replit-specific optimizations and error handling

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with Express middleware integration
- **Database**: Development database with in-memory fallback
- **Proxy Testing**: Local proxy setup for external service testing

### Production Build
- **Frontend**: Static asset generation with Vite build process
- **Backend**: ESBuild compilation for optimized Node.js bundle
- **Database**: Production PostgreSQL with connection pooling
- **Proxy**: Production-grade proxy configuration with monitoring

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production commands
- **Static Serving**: Express serves built frontend assets in production

The application implements a clean separation between game logic, proxy functionality, and UI components, allowing for easy maintenance and feature expansion. The proxy architecture enables access to the original Pédantix service while adding enhanced features like statistics tracking and improved UI/UX.