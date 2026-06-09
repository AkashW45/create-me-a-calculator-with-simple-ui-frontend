const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;
const HOST = '0.0.0.0';

// Health check endpoint - must respond 200 with non-empty body
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all to serve index.html for SPA-like routing (optional but safe)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Calculator server running on http://${HOST}:${PORT}`);
});
