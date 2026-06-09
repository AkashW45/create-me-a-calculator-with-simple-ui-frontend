const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const serverScript = path.join(__dirname, 'server.js');
const BASE_URL = 'http://localhost:8000';

let serverProcess;

// Utility to perform an HTTP GET request and return a promise
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

beforeAll((done) => {
  serverProcess = spawn('node', [serverScript], { stdio: 'pipe' });

  // Wait until the health endpoint responds
  const maxAttempts = 20;
  let attempts = 0;
  const check = () => {
    http.get(`${BASE_URL}/health`, (res) => {
      if (res.statusCode === 200) {
        done();
      } else if (++attempts < maxAttempts) {
        setTimeout(check, 200);
      } else {
        done(new Error('Server did not start in time'));
      }
    }).on('error', () => {
      if (++attempts < maxAttempts) {
        setTimeout(check, 200);
      } else {
        done(new Error('Server did not start in time'));
      }
    });
  };
  setTimeout(check, 300);
}, 20000);

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});

describe('Express Server', () => {
  test('GET /health returns 200 with status ok', async () => {
    const { status, body } = await httpGet(`${BASE_URL}/health`);
    expect(status).toBe(200);
    expect(JSON.parse(body)).toEqual({ status: 'ok' });
  });

  test('GET / (root) serves the index.html static file', async () => {
    const { status, headers, body } = await httpGet(`${BASE_URL}/`);
    expect(status).toBe(200);
    expect(headers['content-type']).toMatch(/text\/html/);
    expect(body).toContain('<html');  // Basic check for HTML document
  });

  test('GET non-existent path still returns 200 and fallback HTML', async () => {
    const { status, headers, body } = await httpGet(`${BASE_URL}/some-unknown-route`);
    expect(status).toBe(200);
    expect(headers['content-type']).toMatch(/text\/html/);
    expect(body).toContain('<html');
  });

  test('GET / returns HTML with button grid layout', async () => {
    const { body } = await httpGet(`${BASE_URL}/`);
    expect(body).toContain('class="button-grid"');
  });

  test('GET / returns HTML with user input display area', async () => {
    const { body } = await httpGet(`${BASE_URL}/`);
    expect(body).toContain('id="input-display"');
  });
});