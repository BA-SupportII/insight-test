# Project Structure

## Active Files

**Core Server**
- `server.js` - Main API server (run: `npm start`)
- `server-dashboard.js` - Dashboard server (run: `npm start:dashboard`)

**Frontend**
- `/public` - Static frontend files

**Source Code**
- `/src` - Application source code

**Configuration**
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `.env` - Environment variables
- `.env.local` - Local environment overrides

**Dependencies**
- `/node_modules` - Node.js packages
- `/.venv` - Python virtual environment

**Data**
- `/data` - Application data directory

## Archive (Unused)

All unused files are organized in `/_archive/` for cleanup:

- `build/` - Old build artifacts (remote-chunk-*.js, remote-main.js)
- `scripts/` - Utility scripts (fetch, inspect, calculate, test, capture)
- `temp/` - Temporary files and old structures
- `data/` - Old data files and summaries
- `outputs/` - Output directories (fetched-out, network-out, py-out, etc.)
- Other: py-capture, pw-browsers, Code to Run, upload_me.zip

## Running the Project

```bash
# Install dependencies
npm install

# Start main server (port 3000)
npm start

# Start dashboard server (port 4001)
npm start:dashboard
```

## Documentation

- `DEVELOPMENT.md` - Development guide
- `DOCS_INDEX.md` - Documentation index
