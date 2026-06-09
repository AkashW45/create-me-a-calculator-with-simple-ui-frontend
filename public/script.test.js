/**
 * @jest-environment jsdom
 */

describe('Calculator', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <div class="buttons">
        <button class="number" data-value="0">0</button>
        <button class="number" data-value="1">1</button>
        <button class="number" data-value="2">2</button>
        <button class="number" data-value="3">3</button>
        <button class="number" data-value="4">4</button>
        <button class="number" data-value="5">5</button>
        <button class="number" data-value="6">6</button>
        <button class="number" data-value="7">7</button>
        <button class="number" data-value="8">8</button>
        <button class="number" data-value="9">9</button>
        <button class="decimal" data-value=".">.</button>
        <button class="operator" data-action="add">+</button>
        <button class="operator" data-action="subtract">-</button>
        <button class="operator" data-action="multiply">*</button>
        <button class="operator" data-action="divide">/</button>
        <button class="equals">=</button>
        <button class="clear">C</button>
      </div>
      <div id="display"></div>
    `;
    require('./script.js');
  });

  let display;

  beforeEach(() => {
    display = document.getElementById('display');
    handleClear();
  });

  test('should perform basic addition', () => {
    clickButton('[data-value="1"]');
    clickButton('[data-value="2"]');
    clickButton('[data-action="add"]');
    clickButton('[data-value="3"]');
    clickButton('.equals');
    expect(display.textContent).toBe('15');
  });

  test('should replace leading zero when a number is pressed', () => {
    clickButton('[data-value="5"]');
    expect(display.textContent).toBe('5');
  });

  test('should prevent multiple decimal points', () => {
    clickButton('[data-value="1"]');
    clickButton('.decimal');
    clickButton('.decimal');
    clickButton('[data-value="2"]');
    expect(display.textContent).toBe('1.2');
  });

  test('should handle division by zero and display Error', () => {
    clickButton('[data-value="5"]');
    clickButton('[data-action="divide"]');
    clickButton('[data-value="0"]');
    clickButton('.equals');
    expect(display.textContent).toBe('Error');
  });

  test('should clear state and display 0 when clear button pressed', () => {
    clickButton('[data-value="9"]');
    clickButton('[data-action="add"]');
    clickButton('[data-value="3"]');
    clickButton('.clear');
    expect(display.textContent).toBe('0');
  });

  test('should chain operators correctly', () => {
    clickButton('[data-value="1"]');
    clickButton('[data-value="2"]');
    clickButton('[data-action="add"]');
    clickButton('[data-value="3"]');
    clickButton('[data-action="subtract"]');
    clickButton('[data-value="5"]');
    clickButton('.equals');
    expect(display.textContent).toBe('10');
  });

  test('should support keyboard input for numbers and Enter', () => {
    dispatchKeyboardEvent('1');
    dispatchKeyboardEvent('2');
    dispatchKeyboardEvent('+');
    dispatchKeyboardEvent('3');
    dispatchKeyboardEvent('Enter');
    expect(display.textContent).toBe('15');
  });

  function clickButton(selector) {
    const button = document.querySelector(selector);
    button.click();
  }

  function dispatchKeyboardEvent(key) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    document.dispatchEvent(event);
  }
});