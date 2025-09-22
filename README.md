# DevToolkit - Developer Utilities Suite

DevToolkit is a comprehensive suite of web-based utilities designed to simplify common development tasks. Built with a **modular monorepo architecture**, this project features a TypeScript Express backend and React 19 frontend, designed for easy expansion with new tools over time.

## 🚀 Currently Implemented Features

### Code Utilities
- **Data Format Converter** - Convert between JSON, YAML, and XML formats with syntax validation
- **Regex Playground** - Test and validate regular expressions with real-time matching
- **UUID Generator** - Generate UUIDs (v1, v4) for testing and development
- **JWT Encoder/Decoder** - Inspect, verify, and create JWT tokens

### Data and Database Tools  
- **Cron Expression Builder** - Build and validate cron expressions with human-readable descriptions

### Authentication System
- **User Registration & Login** - JWT-based authentication with role management
- **Protected Routes** - Role-based access control for tools and features

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript and Vite for fast development
- **Tailwind CSS 4.0** for responsive styling  
- **shadcn/ui** component library with Radix UI primitives
- **React Router v7** for navigation with lazy loading
- **Axios** for API communication
- **Zod** for runtime type validation
- **React Hook Form** for form management

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM for data persistence
- **JWT** authentication with bcrypt password hashing
- **Sharp** for image processing and optimization
- **Redis** integration ready for caching
- **Middleware stack**: Helmet, CORS, Compression, Morgan logging

### Development Tools
- **ESLint + Prettier** for code quality and formatting
- **Husky + lint-staged** for pre-commit hooks
- **Nodemon** for development hot reloading
- **AppMap** for code visualization and debugging

## 📁 Project Structure

```
converse/
├── frontend/          # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-based pages
│   │   ├── routes/       # Navigation and route definitions
│   │   ├── services/     # API communication layer
│   │   └── utils/        # Helper functions and utilities
│   └── package.json
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Custom middleware functions
│   │   ├── models/       # MongoDB/Mongoose schemas
│   │   ├── utils/        # Helper functions
│   │   └── types/        # TypeScript type definitions
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kshitiz-Lall/converse.git
   cd converse
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Configure your MongoDB connection and JWT secrets
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Create environment file  
   cp .env.example .env
   # Configure API URL (default: http://localhost:3000)
   
   # Start development server
   npm run dev
   ```

### Environment Variables

**Backend (.env)**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devtoolkit
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
```

## 🔧 Development Scripts

### Backend Commands
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run lint       # Run ESLint checks
```

### Frontend Commands  
```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier
```

## 🏗️ Architecture Patterns

### Backend Design
- **Controller-Service-Model** pattern for separation of concerns
- **Standardized API responses** using `responseUtils`
- **Middleware pipeline** for security, logging, and error handling
- **JWT-based authentication** with role-based authorization

### Frontend Design  
- **Route-based architecture** with lazy loading for performance
- **Component categorization** system for tool organization
- **Custom hooks** for reusable logic (e.g., `useOutsideClick`)
- **Theme provider** for consistent dark/light mode support

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the established patterns
4. Run tests and linting: `npm run lint:fix`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript strict mode** enabled across the project
- **ESLint + Prettier** for consistent code formatting
- **Conventional commits** for clear commit messages
- **Component-based architecture** with proper separation of concerns

### Adding New Tools
1. **Backend**: Create controller, service, and routes in respective directories
2. **Frontend**: Create page component and add to `toolCategories` in routes
3. **Documentation**: Add usage docs in `/pages/documentation`
4. **Testing**: Ensure proper error handling and validation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/Kshitiz-Lall/converse)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/Kshitiz-Lall/converse/issues)
- **Live Demo**: [DevToolkit](https://kshitiz-lall.github.io/converse) *(Coming Soon)*

---

**Built with ❤️ by [Kshitiz-Lall](https://github.com/Kshitiz-Lall)**
