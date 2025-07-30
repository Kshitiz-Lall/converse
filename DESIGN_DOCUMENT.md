# DevToolkit - Node.js Project Design Document

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Modules and Components](#modules-and-components)
4. [Dependencies](#dependencies)
5. [Architecture Patterns](#architecture-patterns)
6. [Configuration and Setup](#configuration-and-setup)
7. [Coding Guidelines](#coding-guidelines)
8. [Additional Considerations](#additional-considerations)

---

## 1. Project Overview

### Project Description

DevToolkit is a comprehensive suite of web-based utilities designed to simplify common development tasks. The application features a modular, full-stack architecture that allows for easy expansion with new tools over time.

### Goals

- **Developer Productivity**: Provide essential utilities like data format conversion, image optimization, regex testing, and API request testing
- **AI Integration**: Offer AI-powered features including debugging assistance, test case generation, and code refactoring
- **Scalability**: Maintain a modular architecture that supports easy addition of new tools
- **User Experience**: Deliver a modern, responsive interface with proper authentication and authorization
- **Data Management**: Handle LLM leaderboard data through automated polling and analysis

### Target Environment

- **Runtime**: Node.js with TypeScript for type safety
- **Database**: MongoDB for user data and application state
- **Frontend**: React 19 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Deployment**: Containerizable architecture suitable for cloud deployment

### Key Features

#### Developer Tools

- Data Format Converter (JSON, XML, YAML, CSV)
- Image Optimizer with compression and format conversion
- Regex Playground for pattern testing
- Cron Expression Builder
- UUID Generator
- API Request Tester with environment management

#### AI-Powered Features

- AI Debugger for code analysis
- AI Test Case Generator
- Automated Code Refactoring
- AI-Based Stack Overflow Search
- Issue & PR Summary Generator
- Documentation Auto-Generator

#### DevOps & Automation

- Dockerfile Generator & Optimizer
- CI/CD Config Generator
- Server Log Analyzer

#### LLM Analytics

- LLM Leaderboard tracking and analysis
- Cost calculation tools
- Carbon footprint estimation
- Model comparison utilities

---

## 2. Directory Structure

### Backend Structure (`/backend`)

```
backend/
├── src/                          # Source code
│   ├── index.ts                  # Application entry point
│   ├── config/                   # Configuration files
│   │   └── connection.ts         # Database connection setup
│   ├── controllers/              # Request handlers
│   │   ├── authController.ts     # Authentication logic
│   │   ├── formatController.ts   # Data format conversion
│   │   ├── imageController.ts    # Image processing
│   │   ├── llmCalculationController.ts # LLM analytics
│   │   ├── environmentController.ts # Environment management
│   │   └── admin/               # Admin-specific controllers
│   ├── middleware/              # Express middleware
│   │   ├── authMiddleware.ts    # JWT authentication
│   │   ├── adminMiddleware.ts   # Admin authorization
│   │   ├── corsMiddleware.ts    # CORS configuration
│   │   └── errorHandler.ts     # Global error handling
│   ├── models/                  # Database schemas
│   │   ├── User.ts             # User entity
│   │   └── Environment.ts      # Environment configuration
│   ├── routes/                  # Route definitions
│   │   ├── index.ts            # Route aggregation
│   │   ├── authRoutes.ts       # Authentication routes
│   │   ├── formatRoutes.ts     # Format conversion routes
│   │   ├── imageRoutes.ts      # Image processing routes
│   │   ├── leaderboardRoutes.ts # LLM leaderboard routes
│   │   └── admin/              # Admin routes
│   ├── services/               # Business logic layer
│   │   ├── imageService.ts     # Image processing logic
│   │   └── environmentService.ts # Environment management
│   ├── pollers/                # Background processes
│   │   └── llm-leaderboard-poller.ts # LLM data polling
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts           # Common types
│   │   └── image.ts           # Image-related types
│   └── utils/                  # Utility functions
│       ├── formatUtils.ts      # Format conversion utilities
│       ├── responseUtils.ts    # API response helpers
│       └── validationUtils.ts  # Input validation
├── constants/                   # Static data and configurations
│   └── data/                   # Data files
│       └── llm-calculation-data/ # LLM leaderboard datasets
├── tmp/                        # Temporary files
│   └── appmap/                 # Application mapping data
├── package.json                # Node.js dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── nodemon.json               # Development server configuration
└── vitest.config.ts           # Testing configuration
```

### Frontend Structure (`/frontend`)

```
frontend/
├── src/                        # Source code
│   ├── main.tsx               # Application entry point
│   ├── App.tsx                # Root component
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components (shadcn/ui)
│   │   ├── custom/            # Custom components
│   │   ├── layout/            # Layout components
│   │   ├── theme-provider.tsx # Theme management
│   │   └── api-tester/        # API tester components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── DataFormatPage.tsx # Format converter
│   │   ├── ImageOptimizerPage.tsx # Image optimization
│   │   ├── RegexPlaygroundPage.tsx # Regex testing
│   │   ├── auth/              # Authentication pages
│   │   ├── admin/             # Admin panel pages
│   │   ├── documentation/     # Documentation pages
│   │   ├── exceptions/        # Error pages
│   │   └── llm-calculation/   # LLM analytics pages
│   ├── services/              # API communication layer
│   │   ├── formatApi.ts       # Format conversion API
│   │   ├── imageApi.ts        # Image processing API
│   │   ├── testServiceApi.ts  # API testing service
│   │   └── apis/              # Additional API services
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   ├── utils/                 # Utility functions
│   ├── lib/                   # Library configurations
│   ├── config/                # Configuration files
│   └── types/                 # TypeScript definitions
├── public/                     # Static assets
├── constants/                  # Application constants
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Build tool configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── components.json            # shadcn/ui configuration
```

---

## 3. Modules and Components

### Backend Modules

#### Core Application (`src/index.ts`)

- **Responsibility**: Application bootstrapping, middleware setup, route registration
- **Key Features**: Express server initialization, database connection, security middleware (helmet, cors, compression)

#### Authentication System

- **Controllers**: `authController.ts`
- **Middleware**: `authMiddleware.ts`, `adminMiddleware.ts`
- **Models**: `User.ts`
- **Features**:
  - JWT-based authentication
  - Role-based authorization (user, admin, moderator)
  - User registration, login, email verification
  - Profile management and password updates
  - Account status management

#### Data Processing Services

- **Format Controller**: Handles data conversion between JSON, XML, YAML, CSV
- **Image Controller**: Manages image optimization, compression, and format conversion
- **LLM Calculation Controller**: Provides analytics for LLM models and leaderboards

#### Environment Management

- **Purpose**: Manage API testing environments with variable substitution
- **Components**:
  - Environment CRUD operations
  - Variable templating system (`{{variableName}}` syntax)
  - Active environment switching
  - Request processing with environment variable substitution

#### Background Services

- **LLM Leaderboard Poller**:
  - Automated data collection from HuggingFace leaderboard API
  - Scheduled polling every hour
  - Data persistence with timestamp tracking
  - Error handling and retry logic

#### Utility Layer

- **Response Utils**: Standardized API response formatting
- **Validation Utils**: Input validation and sanitization
- **Format Utils**: Data transformation utilities

### Frontend Modules

#### Component Architecture

- **UI Components**: Base components from shadcn/ui library
- **Custom Components**: Application-specific components
- **Layout Components**: Navigation, headers, sidebars, and page layouts

#### Page Components

- **Dashboard**: Central hub with tool navigation
- **Tool Pages**: Individual pages for each utility (format converter, image optimizer, etc.)
- **Authentication Pages**: Login, signup, and profile management
- **Admin Pages**: User management and system administration
- **Documentation Pages**: Help and usage guides

#### Service Layer

- **API Services**: HTTP client wrappers for backend communication
- **Environment Management**: Frontend environment variable handling
- **Authentication Service**: Token management and user state

#### State Management

- **React Context**: Theme provider, authentication context
- **Custom Hooks**: Reusable stateful logic
- **Environment Variables**: Configuration and API endpoints

---

## 4. Dependencies

### Backend Dependencies

#### Core Framework

- **express** (^4.18.2): Web application framework
- **typescript** (^5.8.2): Type-safe JavaScript
- **ts-node** (^10.9.2): TypeScript execution for development

#### Database & Data Management

- **mongoose** (^8.13.0): MongoDB object modeling
- **ioredis** (^5.6.0): Redis client for caching and session management

#### Authentication & Security

- **jsonwebtoken** (^9.0.2): JWT token generation and verification
- **bcryptjs** (^3.0.2): Password hashing
- **helmet** (^7.0.0): Security headers middleware
- **cors** (^2.8.5): Cross-origin resource sharing

#### Data Processing

- **sharp** (^0.33.5): High-performance image processing
- **xml-js** (^1.6.11): XML parsing and generation
- **js-yaml** (^4.1.0): YAML processing

#### HTTP & Networking

- **axios** (^1.8.3): HTTP client for external API calls
- **morgan** (^1.10.0): HTTP request logging
- **compression** (^1.7.4): Response compression

#### Development & Testing

- **nodemon** (^3.0.1): Development server with hot reload
- **vitest** (^3.1.3): Testing framework
- **dotenv** (^16.3.1): Environment variable management

### Frontend Dependencies

#### Core Framework

- **react** (^19.0.0): UI library
- **typescript**: Type safety
- **vite**: Build tool and development server

#### UI & Styling

- **@radix-ui/\***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **sonner**: Toast notifications

#### Routing & Navigation

- **react-router-dom**: Client-side routing

#### Form Handling

- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation

#### HTTP Client

- **axios**: API communication

#### Development Tools

- **eslint**: Code linting
- **prettier**: Code formatting
- **gh-pages**: GitHub Pages deployment

---

## 5. Architecture Patterns

### Model-View-Controller (MVC)

The backend follows a clear MVC pattern:

- **Models**: Database schemas using Mongoose (User, Environment)
- **Views**: JSON API responses
- **Controllers**: Request handlers that orchestrate business logic

### Service Layer Pattern

Business logic is encapsulated in service modules:

- **Image Service**: Image processing operations
- **Environment Service**: Environment variable management
- **Authentication Logic**: User management and security

### Middleware Pattern

Express middleware for cross-cutting concerns:

- **Authentication Middleware**: JWT verification
- **Admin Middleware**: Role-based authorization
- **CORS Middleware**: Cross-origin request handling
- **Error Handler**: Centralized error processing

### Repository Pattern (Implicit)

Data access is abstracted through Mongoose models, providing:

- Consistent data access interface
- Query optimization
- Schema validation

### Component-Based Architecture (Frontend)

React components organized by:

- **Reusability**: Base UI components from shadcn/ui
- **Feature Grouping**: Components grouped by functionality
- **Separation of Concerns**: Presentational vs. container components

### Background Processing

Polling services run independently:

- **LLM Leaderboard Poller**: Scheduled data collection
- **Configurable Intervals**: Adjustable polling frequency
- **Error Recovery**: Robust error handling and logging

### Environment Variable Templating

Custom templating system for API testing:

- **Variable Substitution**: `{{variableName}}` syntax
- **Environment Switching**: Multiple environment support
- **Request Processing**: Automatic variable replacement

---

## 6. Configuration and Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Redis server (optional, for caching)
- npm or yarn package manager

### Environment Variables

#### Backend Configuration

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/devtoolkit

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here

# Server
PORT=3000
NODE_ENV=development

# Redis (optional)
REDIS_URL=redis://localhost:6379

# External APIs
LLM_LEADERBOARD_API_URL=https://open-llm-leaderboard-open-llm-leaderboard.hf.space/api/leaderboard/formatted
```

#### Frontend Configuration

Create environment files for different deployment targets:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=DevToolkit Development

# .env.production
VITE_API_BASE_URL=https://api.devtoolkit.com/api
VITE_APP_TITLE=DevToolkit
```

### Installation Steps

#### Backend Setup

```bash
cd backend
npm install
npm run build
npm run dev  # Development mode
npm start    # Production mode
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Development server
npm run build  # Production build
```

#### Database Setup

1. Install and start MongoDB
2. The application will automatically create required collections
3. User roles are managed through the authentication system

#### Background Services

```bash
# Start LLM leaderboard poller
cd backend
npm run poller:dev    # Development mode
npm run poller:start  # Production mode
```

### TypeScript Configuration

#### Backend (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Frontend (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 7. Coding Guidelines

### TypeScript Standards

- **Strict Mode**: All TypeScript strict checks enabled
- **Type Definitions**: Explicit types for all public interfaces
- **Interface Naming**: PascalCase with descriptive names
- **Enum Usage**: Prefer string enums over numeric enums

### Code Organization

- **File Naming**: camelCase for files, PascalCase for components
- **Import Order**: External libraries, internal modules, relative imports
- **Export Strategy**: Named exports preferred over default exports

### Error Handling

- **Consistent Responses**: Standardized error response format
- **Logging**: Comprehensive error logging with context
- **Validation**: Input validation at controller level
- **HTTP Status Codes**: Proper status code usage

### Security Best Practices

- **Password Hashing**: bcrypt with appropriate salt rounds
- **JWT Security**: Secure token generation with expiration
- **Input Sanitization**: Validation and sanitization of all inputs
- **CORS Configuration**: Restrictive CORS policy for production

### Database Patterns

- **Schema Validation**: Mongoose schema validation
- **Indexing**: Appropriate database indexes for performance
- **Transactions**: Use transactions for data consistency
- **Connection Management**: Proper connection pooling and error handling

### Frontend Standards

- **Component Structure**: Functional components with hooks
- **State Management**: Local state with useState, global state with Context
- **Styling**: Tailwind CSS classes with consistent spacing
- **Accessibility**: ARIA labels and semantic HTML

### API Design

- **RESTful Endpoints**: Follow REST conventions
- **Versioning**: API versioning strategy
- **Documentation**: Comprehensive API documentation
- **Rate Limiting**: Implement rate limiting for production

---

## 8. Additional Considerations

### Performance Optimizations

#### Backend

- **Compression**: Response compression middleware
- **Caching**: Redis for session and frequently accessed data
- **Database Queries**: Optimized queries with proper indexing
- **Image Processing**: Efficient image optimization with Sharp
- **Background Processing**: Non-blocking operations for data polling

#### Frontend

- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Responsive images and lazy loading
- **Caching**: Browser caching strategies

### Security Measures

#### Authentication & Authorization

- **JWT Security**: Secure token storage and transmission
- **Role-Based Access**: Admin, moderator, and user roles
- **Password Policy**: Strong password requirements
- **Session Management**: Secure session handling

#### Data Protection

- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Anti-CSRF tokens where needed

#### Infrastructure Security

- **HTTPS**: SSL/TLS encryption for production
- **Security Headers**: Helmet.js security headers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Environment Variables**: Secure configuration management

### Monitoring and Logging

#### Application Monitoring

- **Request Logging**: Morgan middleware for HTTP logging
- **Error Tracking**: Centralized error handling and logging
- **Performance Monitoring**: Response time tracking
- **Health Checks**: Endpoint health monitoring

#### Business Metrics

- **User Analytics**: User engagement tracking
- **API Usage**: Endpoint usage statistics
- **LLM Data**: Leaderboard polling success rates
- **Error Rates**: Application error monitoring

### Scalability Considerations

#### Horizontal Scaling

- **Stateless Design**: Stateless application architecture
- **Load Balancing**: Support for multiple server instances
- **Database Scaling**: MongoDB replica sets and sharding
- **Caching Layer**: Redis for distributed caching

#### Vertical Scaling

- **Resource Optimization**: Efficient memory and CPU usage
- **Connection Pooling**: Database connection optimization
- **Async Operations**: Non-blocking I/O operations

### Deployment Strategy

#### Containerization

- **Docker Support**: Dockerfile for containerized deployment
- **Environment Management**: Docker environment configuration
- **Multi-stage Builds**: Optimized production images

#### CI/CD Pipeline

- **Automated Testing**: Unit and integration tests
- **Build Automation**: Automated build and deployment
- **Environment Promotion**: Staging to production workflow

#### Cloud Deployment

- **Cloud Compatibility**: AWS, Azure, GCP deployment ready
- **Environment Variables**: Cloud-based configuration management
- **Monitoring Integration**: Cloud monitoring services

### Maintenance and Updates

#### Code Maintenance

- **Dependency Updates**: Regular dependency updates
- **Security Patches**: Timely security patch application
- **Code Reviews**: Peer review process
- **Documentation**: Comprehensive code documentation

#### Data Management

- **Backup Strategy**: Regular database backups
- **Data Retention**: Appropriate data retention policies
- **Migration Scripts**: Database migration management

---

## Conclusion

This design document outlines the comprehensive architecture of DevToolkit, a modern full-stack Node.js application. The project demonstrates best practices in:

- **Modular Architecture**: Clear separation of concerns with well-defined modules
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Security**: Robust authentication, authorization, and data protection
- **Scalability**: Horizontal and vertical scaling considerations
- **Performance**: Optimized for speed and efficiency
- **Maintainability**: Clean code structure with comprehensive documentation

The architecture supports easy extension with new tools while maintaining code quality, security, and performance standards suitable for production deployment.
