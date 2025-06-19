# Mermaid ERD Visualizer

A powerful web application for visualizing Entity Relationship Diagrams from Mermaid syntax, optimized for **large and complex ERD diagrams**.

![Mermaid ERD Visualizer Screenshot](docs/images/image.png)

_Interactive ERD visualization showing database schema with tables, relationships, and an intuitive sidebar for navigation._

## ✨ Features

- **Large Diagram Support**: Efficiently handles and renders large, complex ERD diagrams
- **Interactive Visualization**: Pan, zoom, and explore your database schemas
- **Mermaid Parser**: Comprehensive parsing and validation of Mermaid ERD syntax
- **Drag & Drop**: Upload files from file system or code editors
- **Real-time Parsing**: Instant feedback on syntax errors and warnings

## 🚀 Development

### Requirements

- **Node.js**: >= 18.0.0 (LTS recommended)

### Setup

```sh
# Check Node.js version
node --version

# Install dependencies
npm install

# Start development server
npm run dev
```

### Supported File Formats

- `.mmd` - Mermaid diagram files
- `.md` - Markdown files with Mermaid ERD syntax
- `.txt` - Plain text files with Mermaid ERD syntax

## Tech Stack

- **Frontend**: React, Remix, TypeScript
- **Visualization**: D3.js, ELK.js
- **Styling**: Tailwind CSS
- **Parser**: Custom Mermaid ERD parser

## License

MIT
