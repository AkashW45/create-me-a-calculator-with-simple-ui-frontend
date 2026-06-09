# Calculator Web Application

A simple single-page calculator built with HTML, CSS, and JavaScript, served by an Express static file server.

## Architecture

As per ADR-001 and ADR-002:
- Frontend: Plain HTML/CSS/JS with in-memory state.
- Backend: Node.js Express server serving static files and providing health endpoint.

## Deployment

The server listens on `0.0.0.0:8000` and exposes:
- `GET /health` → returns `{"status":"ok"}`
- Static files served from the `public/` folder.

### Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start server:
   ```
   npm start
   ```
3. Open http://localhost:8000 in a browser.

### Running with Docker

```
docker build -t calculator .
docker run -p 8000:8000 calculator
```

## Usage

- Click number buttons or use keyboard (0-9, ., +, -, *, /, Enter, Escape).
- C button clears the current calculation.
- Division by zero displays "Error".

## Testing

No automated tests yet. Manual testing in browser.
