const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Capture the express app instance by mocking app.listen
let app;
let originalListen;

beforeAll(() => {
  // Prepare a minimal public/index.html for the static file test
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  fs.writeFileSync(
    path.join(publicDir, 'index.html'),
    '<html><head></head><body id="calculator-ui">Calculator</body></html>',
    'utf8'
  );

  // Mock express.application.listen to capture the app instance
  const express = require('express');
  originalListen = express.application.listen;
  express.application.listen = jest.fn(function (port, host, callback) {
    app = this; // capture the express app
    if (callback) callback();
    return { close: jest.fn() };
  });

  // Now require the server – it will call our mocked listen
  require('./server');
});

afterAll(() => {
  // Restore the original listen method
  const express = require('express');
  express.application.listen = originalListen;

  // Clean up the dummy public directory
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(path.join(publicDir, 'index.html'))) {
    fs.unlinkSync(path.join(publicDir, 'index.html'));
  }
  if (fs.existsSync(publicDir)) {
    fs.rmdirSync(publicDir);
  }
});

describe('Server endpoints', () => {
  test('GET /health returns 200 with status ok and JSON content-type', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.headers['content-type']).toMatch(/json/);
  });

  test('GET / serves index.html with status 200 and text/html content-type', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Calculator');
  });

  test('GET / returns exactly the dummy content we created', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('id="calculator-ui"');
  });

  test('GET /nonexistent returns 404 because static middleware cannot find the file', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });

  test('GET /health returns non-empty body', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toBeDefined();
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
  });
});