import { JSDOM } from 'jsdom';

let dom;
let window;

beforeEach(() => {
  dom = new JSDOM(`<!DOCTYPE html>
    <div id="display"></div>
    <div id="expression"></div>
    <div class="buttons">
      <button class="number" data-value="1">1</button>
      <button class="number" data-value="2">2</button>
      <button class="operator" data-action="add">+</button>
      <button class="operator" data-action="subtract">-</button>
      <button class="operator" data-action="multiply">*</button>
      <button class="operator" data-action="divide">/</button>
      <button class="equals">=</button>
      <button class="clear">C</button>
      <button class="decimal" data-value=".">.</button>
    </div>
  `, { runScripts: 'dangerously' });
  window = dom.window;
  global.document = window.document;
  global.window = window;
  jest.resetModules();
  require('./script');
});

afterEach(() => {
  dom.window.close();
});

describe('Calculator functionality', () => {
  test('happy path: input numbers, perform addition, display result', () => {
    window.handleNumber('3');
    window.handleNumber('3');
    expect(window.document.getElementById('display').textContent).toBe('33');
    window.handleOperator('add');
    window.handleNumber('5');
    expect(window.document.getElementById('display').textContent).toBe('5');
    window.compute();
    expect(window.document.getElementById('display').textContent).toBe('38');
  });

  test('happy path: clear resets display and state', () => {
    window.handleNumber('9');
    window.handleOperator('multiply');
    window.handleNumber('2');
    window.handleClear();
    expect(window.document.getElementById('display').textContent).toBe('0');
    expect(window.document.getElementById('expression').textContent).toBe('');
  });

  test('edge case: prevents multiple decimals in a number', () => {
    window.handleNumber('1');
    window.handleNumber('.');
    window.handleNumber('2');
    expect(window.document.getElementById('display').textContent).toBe('1.2');
    window.handleNumber('.');
    expect(window.document.getElementById('display').textContent).toBe('1.2');
  });

  test('error path: division by zero shows Error', () => {
    window.handleNumber('5');
    window.handleOperator('divide');
    window.handleNumber('0');
    window.compute();
    expect(window.document.getElementById('display').textContent).toBe('Error');
  });

  test('edge case: operator sequencing computes previous operation', () => {
    window.handleNumber('5');
    window.handleOperator('add');
    window.handleNumber('3');
    window.handleOperator('subtract');
    expect(window.document.getElementById('display').textContent).toBe('8');
  });

  test('keyboard support: digit key updates display', () => {
    const event = new window.KeyboardEvent('keydown', { key: '7' });
    window.document.dispatchEvent(event);
    expect(window.document.getElementById('display').textContent).toBe('7');
  });
});