# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-06-19

### 🔒 Security

- **BREAKING**: Removed server-side file reading API to prevent directory traversal attacks
- Enhanced file validation with comprehensive security checks
- Removed ability to read arbitrary server files via drag & drop

### ✨ Features

- **Universal Browser Support**: Now works seamlessly across Chrome, Firefox, Safari, and Edge
- **Enhanced Drag & Drop**: Improved file system drag and drop with better error handling
- **Smart File Validation**: File type, size, and content validation
- **Better User Feedback**: Clear error messages and loading states

### 🛠️ Improvements

- Simplified drag & drop implementation using only universal browser APIs
- Removed Chrome/Edge-specific File System Access API for broader compatibility
- Enhanced file processing with comprehensive error handling
- Improved UI with cleaner, more intuitive design

### 📚 Documentation

- Updated README.md with Node.js version requirements (>=18.0.0)
- Added supported file formats documentation (.mmd, .md, .txt)
- Enhanced development setup instructions

### 🐛 Bug Fixes

- Fixed drag counter flickering on nested elements
- Resolved security vulnerabilities in file path handling
- Improved drag state management across different browsers

### 🔧 Technical Changes

- Migrated from server-side file reading to client-side only processing
- Removed Remix API route for file reading
- Simplified component architecture for better maintainability
- Added comprehensive TypeScript typing for file operations

## Previous Releases

See [GitHub Releases](https://github.com/delexw/mermaid-erd-visualizer/releases) for earlier versions.
