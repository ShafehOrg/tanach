# Contributing to Tanach API

Thank you for your interest in contributing to the Tanach API! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/ShafehOrg/tanach.git
   cd tanach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small

## Testing

- All new features must include tests
- Maintain or improve code coverage
- Run `npm run test:coverage` to check coverage
- Tests are written using Vitest

## Pull Request Process

1. Ensure all tests pass
2. Update the README.md if needed
3. Update the CHANGELOG.md (if exists)
4. Request review from maintainers
5. Address any feedback

## Data Updates

If you need to update the Tanach data:

1. Modify the source data in `tanach.js`
2. Run the conversion script:
   ```bash
   npm run convert
   ```
3. Rebuild and test:
   ```bash
   npm run build
   npm test
   ```

## Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description
- Include steps to reproduce
- Add relevant code examples
- Specify your environment (Node.js version, OS, etc.)

## Questions?

Feel free to open an issue for any questions or concerns!

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
