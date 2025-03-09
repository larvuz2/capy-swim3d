# GitHub Deployment Rules for capy-swim3d

This document outlines the standard process for deploying changes to the capy-swim3d GitHub repository. Following these rules ensures consistency in our deployment process.

## Repository Structure

- Repository Name: capy-swim3d
- Owner: larvuz2
- Main Branch: main

## Deployment Process

### 1. Creating a New Repository

When creating a new repository:

```javascript
// Create the repository
mcp__create_repository({
  name: "capy-swim3d",
  description: "A physics-based character controller using Rapier physics engine and Three.js for rendering",
  private: false,
  autoInit: false
});
```

### 2. Initial Repository Setup

For the initial setup, create a README.md file first to initialize the repository:

```javascript
// Create README.md as the first file
mcp__create_or_update_file({
  owner: "larvuz2",
  repo: "capy-swim3d",
  path: "README.md",
  message: "Initial commit: Add README",
  content: "# Project Title\n\nProject description...",
  branch: "main"
});
```

### 3. Adding Files to the Repository

After initializing the repository, add files one by one with descriptive commit messages:

```javascript
// Add a file to the repository
mcp__create_or_update_file({
  owner: "larvuz2",
  repo: "capy-swim3d",
  path: "path/to/file.js",
  message: "Add file.js with specific functionality",
  content: "file content here...",
  branch: "main"
});
```

### 4. Updating Existing Files

When updating existing files, include the file's SHA to ensure you're updating the correct version:

```javascript
// Update an existing file
mcp__create_or_update_file({
  owner: "larvuz2",
  repo: "capy-swim3d",
  path: "path/to/file.js",
  message: "Update file.js to improve functionality",
  content: "updated file content...",
  branch: "main",
  sha: "existing_file_sha_here"
});
```

### 5. File Organization

Maintain the following file organization:

- `index.html` - Main HTML file
- `src/` - Source code directory
  - `main.js` - Entry point
  - `physics.js` - Rapier physics setup
  - `character.js` - Character controller
  - `input.js` - Input handling
  - `scene.js` - Three.js scene setup
- `package.json` - Project configuration
- `netlify.toml` - Netlify deployment configuration
- `.gitignore` - Git ignore file
- `README.md` - Project documentation

### 6. Commit Message Conventions

Use clear, descriptive commit messages that explain the purpose of the change:

- "Add [file/feature]" for new files or features
- "Update [file/feature] to [purpose]" for modifications
- "Fix [issue] in [file/feature]" for bug fixes
- "Implement [feature]" for new implementations
- "Refactor [file/feature]" for code refactoring

### 7. Deployment Order

When deploying a complete project, follow this order:

1. README.md (initial commit)
2. index.html
3. package.json
4. netlify.toml
5. .gitignore
6. Source files (main.js, scene.js, physics.js, input.js, character.js)

### 8. Netlify Deployment

After pushing all files to GitHub, deploy to Netlify with these settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: None required

## Example Deployment Sequence

```javascript
// 1. Create repository
mcp__create_repository({
  name: "capy-swim3d",
  description: "A physics-based character controller using Rapier physics engine and Three.js for rendering",
  private: false,
  autoInit: false
});

// 2. Add README.md
mcp__create_or_update_file({
  owner: "larvuz2",
  repo: "capy-swim3d",
  path: "README.md",
  message: "Initial commit: Add README",
  content: "# Physics-Based Character Controller\n\nA simple physics-based character controller...",
  branch: "main"
});

// 3. Add index.html
mcp__create_or_update_file({
  owner: "larvuz2",
  repo: "capy-swim3d",
  path: "index.html",
  message: "Add index.html",
  content: "<!DOCTYPE html>...",
  branch: "main"
});

// Continue with other files...
```

## Troubleshooting

- If you encounter a "Conflict: Git Repository is empty" error, ensure you've created at least one file (typically README.md) before pushing other files.
- If you get a "SHA mismatch" error when updating a file, fetch the current file's SHA before updating.

By following these deployment rules, we maintain consistency in our GitHub repository structure and deployment process. 