const request = require('supertest');

// Mock express to capture the app instance and prevent starting the server
let app;
jest.mock('express', () => {
  const actualExpress = jest.requireActual('express');
  return () => {
    app = actualExpress();
    app.listen = jest.fn(() => ({ close: jest.fn() }));
    return app;
  };
});

// Require the server module after mocking so the routes are registered on our mock app
require('./server');

describe('Calculator Server', () => {
  describe('GET /health', () => {
    it('should return 200 with status ok and non‑empty body', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
      expect(JSON.stringify(res.body).length).toBeGreaterThan(0);
    });
  });

  describe('GET /', () => {
    it('should return 200 and serve the calculator UI', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      // Check for key calculator elements in the inline HTML
      expect(res.text).toContain('<div class="calculator" id="app">');
      expect(res.text).toContain('id="inputDisplay"');
      expect(res.text).toContain('id="resultDisplay"');
      expect(res.text).toContain('data-action="equals"');
    });

    it('should include the handleEquals function definition (fix verification)', async () => {
      const res = await request(app).get('/');
      expect(res.text).toContain('function handleEquals()');
    });

    it('should attach the equals button event listener separately', async () => {
      const res = await request(app).get('/');
      // Verify the explicit event listener that was missing before
      expect(res.text).toContain(
        'document.querySelector(\'[data-action="equals"]\').addEventListener(\'click\', handleEquals)'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.statusCode).toBe(404);
    });
  });
});