const request = require('supertest');
let app;

// Mock express to prevent server listening and to capture the app instance
jest.mock('express', () => {
  const actualExpress = jest.requireActual('express');
  const fn = () => {
    app = actualExpress();
    // Prevent actual listening
    app.listen = jest.fn((...args) => {
      // Call the callback if provided (the server.js callback)
      const cb = args[2] || args[1] || args[0];
      if (typeof cb === 'function') cb();
      return { close: jest.fn() };
    });
    return app;
  };
  // Copy static methods from actual express
  fn.static = actualExpress.static;
  fn.json = actualExpress.json;
  fn.urlencoded = actualExpress.urlencoded;
  return fn;
});

// Now require the server to set up routes on the mocked app
require('./server');

describe('Calculator Server', () => {
  afterAll(() => {
    // Clean up if needed (e.g., close any open handles)
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Catch-all route', () => {
    it('should return 200 with HTML containing calculator UI', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('<!DOCTYPE html>');
      expect(res.text).toContain('<title>Calculator</title>');
      expect(res.text).toContain('id="inputDisplay"');
      expect(res.text).toContain('id="resultDisplay"');
      expect(res.text).toContain('class="buttons"');
    });

    it('should serve the calculator UI for any path (catch-all)', async () => {
      const res = await request(app).get('/any/random/path');
      expect(res.status).toBe(200);
      expect(res.text).toContain('<title>Calculator</title>');
    });

    it('should return Content-Type text/html', async () => {
      const res = await request(app).get('/');
      expect(res.headers['content-type']).toMatch(/html/);
    });
  });

  describe('UI layout and input display', () => {
    it('should contain a grid-based buttons container', async () => {
      const res = await request(app).get('/');
      // Check that buttons div has grid styles injected inline or class 'buttons'
      // The HTML includes <style> with .buttons { display: grid; ... }
      expect(res.text).toMatch(/\.buttons\s*\{[^}]*display:\s*grid[^}]*\}/);
      expect(res.text).toContain('class="buttons"');
    });

    it('should display the user input area', async () => {
      const res = await request(app).get('/');
      expect(res.text).toContain('id="inputDisplay"');
      expect(res.text).toContain('inputDisplay.textContent = input || \' \'');
    });
  });
});