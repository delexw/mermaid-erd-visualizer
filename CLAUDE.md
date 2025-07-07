# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ERD Explorer is a React-based web application for visualizing Entity Relationship Diagrams from Mermaid syntax, specifically optimized for large and complex ERD diagrams. Built with Remix, TypeScript, and D3.js.

## Essential Commands

### Development

```bash
npm run dev                 # Start development server (Remix + Vite)
npm run build              # Build for production
npm run start              # Start production server
```

### Auto-Loading ERD Files

The application supports auto-loading ERD files via URL parameters, bypassing the file uploader:

```bash
# Development
npm run dev
# Then visit: http://localhost:5173/?file=app/data/test-erd.mmd

# Production
npm run start
# Then visit: http://localhost:3000/?file=app/data/test-erd.mmd
```

**Supported file types:** `.mmd`, `.md`, `.txt`  
**File requirements:** Must contain valid Mermaid ERD syntax starting with `erDiagram`

#### Usage Notes
- **Use relative paths within the project**: `app/data/test-erd.mmd`
- **Place ERD files in the project**: Files should be accessible via the web server
- **Example files**: Check `app/data/` for sample ERD diagrams

#### Quick Launch Script

A convenience script is available to launch the app with a file:

```bash
# Make executable (first time only)
chmod +x launch-with-file.sh

# Launch with file in development mode
./launch-with-file.sh app/data/test-erd.mmd

# Launch with file in production mode
./launch-with-file.sh app/data/test-erd.mmd prod
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run lint:fix           # Run ESLint with auto-fix
npm run typecheck          # Run TypeScript type checking
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
npm run clean              # Format and lint fix in sequence
```

## Architecture

### Core Libraries

- **Frontend**: React 18, Remix (SSR framework), TypeScript
- **Visualization**: D3.js (selection, zoom), ELK.js (graph layout), Framer Motion
- **Parser**: Mermaid.js (@mermaid-js/parser for parsing ERD syntax)
- **Styling**: Tailwind CSS

### Key Directory Structure

```
app/
├── components/           # React components (Header, Sidebar, MermaidUploader, etc.)
├── contexts/            # React contexts (ERDContext for state management)
├── lib/
│   ├── erdRenderer/     # D3.js-based ERD visualization engine
│   │   ├── components/  # SVG rendering components (tables, relationships)
│   │   ├── models/      # Data models and layout engine
│   │   └── utils/       # Positioning, grouping, zoom utilities
│   └── mermaidParser/   # Mermaid ERD syntax parser
├── routes/              # Remix routes
└── types/               # TypeScript type definitions
```

### Data Flow Architecture

1. **Input**: Mermaid ERD files (.mmd, .md, .txt) via drag-and-drop or file upload
2. **Parsing**: `mermaidParser` converts Mermaid syntax to internal types (app/types/erd.ts)
3. **Layout**: `GraphLayoutEngine` (ELK.js) calculates optimal table positions
4. **Rendering**: `ERDRenderer` (D3.js) creates interactive SVG visualization
5. **State**: `ERDContext` manages global application state

### Parser Integration

The project uses Mermaid.js API for parsing:

- `parseMermaidERDWithJS()` uses `mermaid.mermaidAPI.getDiagramFromText()`
- Parser extracts entities via `parser.yy.getEntities()` and relationships via `parser.yy.getRelationships()`
- Data is mapped to internal types: `Table[]` and `Relationship[]`

### Rendering Pipeline

1. **Layout Calculation**: ELK.js computes table positions
2. **Model Creation**: TableModel and RelationshipModel wrap data
3. **SVG Generation**: D3.js creates interactive SVG elements
4. **Position Updates**: Real-time relationship positioning during table drag
5. **Interaction**: Zoom, pan, table selection, and focus behaviors

## Development Patterns

### Type Safety

- Strict TypeScript configuration with `noEmit: true` (Vite handles builds)
- Consistent type imports enforced by ESLint
- Custom type definitions in `app/types/erd.ts`

### Component Patterns

- React components use TypeScript interfaces for props
- Context providers for state management (ERDContext)
- Custom hooks pattern (`useERD()`)
- Drag-and-drop with security validation

### File Processing

- Client-side file processing with FileReader API
- Security validations: file type, size limits, content validation
- Support for .mmd, .md, .txt files containing Mermaid ERD syntax

### Performance Optimization

- Progress callbacks during rendering (`onRenderingProgress`)
- Efficient relationship grouping and positioning
- Zoom-to-fit and focus behaviors
- ResizeObserver for responsive layouts

## Development Notes

### Testing

No test framework is currently configured. When adding tests, check existing patterns in the codebase first.

### Linting and Formatting

ESLint configuration enforces import ordering, consistent type imports, and Prettier integration. Always run `npm run clean` before committing.

### Security Considerations

File upload component includes security validations:

- File type validation (reject non-text files)
- File size limits (10MB max)
- Content validation (reject file paths, accept only Mermaid content)
- XSS protection through controlled content processing
