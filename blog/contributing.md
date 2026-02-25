# Contributing Guide

## Welcome! 👋

Thank you for your interest in contributing to the NurOS Package List project! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome people from all backgrounds
- Focus on constructive feedback
- Report inappropriate behavior to maintainers

## Ways to Contribute

### 1. Submit Bug Reports

Found a bug? Let us know:

1. **Check existing issues** - Avoid duplicates
2. **Create a detailed report**:
   - What you expected
   - What actually happened
   - Steps to reproduce
   - Environment (OS, browser, etc.)
   - Screenshots if applicable

3. **Use bug template**: 
   - Go to Issues → Report bug
   - Fill in the provided template

### 2. Suggest Features

Have an idea? We'd love to hear it:

1. **Describe the feature clearly**
2. **Explain the use case**
3. **Provide examples if possible**
4. **Note any implementation concerns**

### 3. Improve Documentation

Documentation improvements are always welcome:

1. **Fix typos and errors**
2. **Clarify unclear sections**
3. **Add examples**
4. **Translate to other languages** (future)
5. **Improve architecture diagrams**

### 4. Enhance the Frontend

Join us in building features:

1. **Review open issues** for ideas
2. **Add UI enhancements**
3. **Improve accessibility**
4. **Optimize performance**
5. **Fix known bugs**

### 5. Improve Package Metadata

Help package maintainers:

1. **File issues with inaccurate metadata**
2. **Test and validate package data**
3. **Help maintain categories and tags**

## Development Setup

### Prerequisites

- Node.js 22.x
- pnpm 9.x
- Git

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/NurOS-Linux/listpkgs.nuros.org.git
cd listpkgs.nuros.org

# Install frontend dependencies
cd listpkgs.nuros.front-end
pnpm install

# Install documentation dependencies (VitePress)
cd ../blog
pnpm install
```

### Frontend Development

```bash
cd listpkgs.nuros.front-end

# Start development server
pnpm dev
# Access at http://localhost:5173

# Format code
pnpm format

# Lint code
pnpm lint

# Build for production
pnpm build

# Run tests
pnpm test

# Test single file
pnpm test -- component.spec.ts
```

### Documentation Development

```bash
cd blog

# Start VitePress dev server
pnpm docs:dev
# Access at http://localhost:5173

# Build documentation
pnpm docs:build

# Preview build locally
pnpm docs:preview
```

## Making Changes

### 1. Create a Feature Branch

```bash
# Create from main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
# or for fixes:
git checkout -b fix/bug-name
```

### Naming Convention
- Features: `feature/add-dark-mode`
- Bugfixes: `fix/search-not-working`
- Docs: `docs/update-readme`
- Tests: `test/add-search-tests`

### 2. Make Your Changes

**Frontend Code**:

```bash
cd listpkgs.nuros.front-end

# Make changes to src/
# - Add components in src/components/
# - Add styles in src/styles/components/
# - Add hooks in src/hooks/
# - Update tests in tests/

# Format and lint
pnpm format
pnpm lint
```

**Documentation**:

```bash
# Make changes to blog/

# Format markdown
pnpm format

# Build and preview
pnpm docs:build
pnpm docs:preview
```

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add dark mode toggle

- Add dark mode CSS variables
- Add theme toggle in header
- Implement system preference detection
- Update styling for dark colors"
```

**Commit Message Format**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `perf:` - Performance
- `test:` - Test changes
- `chore:` - Maintenance

**Be descriptive!**
- First line: Brief summary (50 chars max)
- Blank line
- Detailed explanation (wrap at 72 chars)
- Reference issues: `Fixes #123`
- List changes clearly

### 4. Format and Test

```bash
# Always format before pushing
pnpm format

# Run linter
pnpm lint --max-warnings=0

# Run tests
pnpm test

# For docs
cd ../blog
pnpm docs:build
```

### 5. Push and Create PR

```bash
# Push feature branch
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
# - Describe what you changed
# - Reference any issues
# - Ask for review
```

## Pull Request Process

### Before Submitting

1. **Code Quality**:
   - ✅ All tests pass
   - ✅ Code formatted with Prettier
   - ✅ Linted with ESLint (0 errors)
   - ✅ No console errors

2. **Documentation**:
   - ✅ README updated if needed
   - ✅ Comments added for complex code
   - ✅ API changes documented

3. **Testing**:
   - ✅ New features have tests
   - ✅ Bug fixes have regression tests
   - ✅ All 30 tests pass locally

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## How to Test
Steps to verify the changes

## Screenshots (if UI change)
Before/after screenshots

## Checklist
- [ ] Code formatted with Prettier
- [ ] Linted with ESLint
- [ ] Tests pass locally
- [ ] No new warnings
- [ ] Documentation updated

## Fixes
Fixes #(issue number)
```

### Review Process

1. **Automated Checks**:
   - GitHub Actions runs tests
   - Linting checks pass
   - Build succeeds

2. **Code Review**:
   - At least one approval required
   - Maintainers provide feedback
   - Address review comments

3. **Merge**:
   - Squash commits (for bug fixes)
   - Create merge commit (for features)
   - Delete branch after merge

## Style Guide

### TypeScript/TSX

```typescript
// Use explicit types
const fetchPackages = async (): Promise<Package[]> => {
  // ...
};

// Use const by default
const component = () => {
  // ...
};

// Use descriptive names
const [filteredPackages, setFilteredPackages] = createSignal([]);

// Export types
export interface Package {
  name: string;
  version: string;
}
```

### SCSS

```scss
// Use variables
$primary-color: var(--primary-color);

// Use BEM naming
.package-card {
  &__header { }
  &__body { }
  &--featured { }
  &:hover { }
}

// Nest related rules
.search-bar {
  display: flex;
  
  &__input {
    flex: 1;
  }
  
  &__button {
    margin-left: $spacing-md;
  }
}
```

### Markdown

```markdown
# Use single # for main heading

## Use ## for sections

Use **bold** for emphasis, not __underscores__.

- Use dashes for lists
  - Nest with 2-space indent

1. Number for ordered lists
2. Keep numbers sequential

Use `inline code` for variables
Use code blocks for examples

> Use blockquotes for important notes
```

## Documentation Structure

All documentation in `blog/`:
- `index.md` - Main entry point
- `getting-started.md` - Quick start guide
- `architecture.md` - System design
- `frontend-guide.md` - UI/UX documentation
- `api-reference.md` - Integration guide
- `deployment.md` - DevOps guide
- `contributing.md` - This file!
- `faq.md` - Common questions

## Reporting Security Issues

**Do not** open public issues for security vulnerabilities.

Instead:
1. Email security concerns to maintainers
2. Provide detailed vulnerability description
3. Suggest remediation if possible
4. Allow time for fix before public disclosure

## Getting Help

- **Issues**: GitHub Issues for bugs/features
- **Discussions**: GitHub Discussions for questions
- **Chat**: Join NurOS community channels
- **Docs**: Check [FAQ](./faq.md) and [Architecture](./architecture.md)

## Recognition

Contributors are recognized:
- ✅ Git commits show your name
- ✅ GitHub shows your contribution graph
- ✅ Major contributors listed in README
- ✅ Featured in release notes

## License

By contributing, you agree your contributions are licensed under the MIT License.

---

Thank you for contributing! 🎉
