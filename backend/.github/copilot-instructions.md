# Node.js + Express.js Coding Standards

## 1. Project Structure
- Organize code by feature (controllers, models, routes, middlewares, utils).
- Use a `src/` directory for source code.
- Place configuration files in a `config/` directory.

## 2. File Naming
- Use `camelCase` for files (e.g., `userController.js`).
- Use `.js` or `.ts` extensions as appropriate.

## 3. Code Style
- Use 2 spaces for indentation.
- Use single quotes for strings.
- End statements with semicolons.
- Use `const` and `let` (avoid `var`).
- Prefer arrow functions for callbacks.

## 4. Imports & Exports
- Use ES6 `import`/`export` syntax (or `require`/`module.exports` for CommonJS).
- Group imports: built-in, external, internal.

## 5. Express.js Practices
- Use `async/await` for asynchronous code.
- Always handle errors (try/catch in async functions).
- Use middleware for authentication, validation, and error handling.
- Separate route definitions from controller logic.
- Validate and sanitize all incoming data.

## 6. Environment Variables
- Store secrets and config in `.env` files.
- Never commit `.env` or sensitive data to version control.

## 7. Security
- Use `helmet` for HTTP headers.
- Sanitize user input to prevent injection attacks.
- Hash passwords with `bcryptjs` or similar.
- Never expose sensitive fields (like passwords) in API responses.

## 8. Logging
- Use a logging library (e.g., `winston`, `morgan`) for requests and errors.
- Avoid `console.log` in production.

## 9. Documentation
- Comment complex logic and public APIs.
- Use JSDoc or TypeScript for type annotations.
- Document API endpoints (e.g., with Swagger/OpenAPI).

## 10. Testing
- Write unit and integration tests (e.g., with `jest`, `supertest`).
- Keep tests in a `tests/` directory.

## 11. Version Control
- Use `.gitignore` to exclude `node_modules`, logs, and environment files.
- Commit code in small, descriptive increments.

## 12. Dependency Management
- Use `npm` or `yarn` for dependencies.
- Regularly update dependencies and audit for vulnerabilities.

---
Adhering to these standards ensures maintainable, secure, and scalable Node.js + Express.js applications.