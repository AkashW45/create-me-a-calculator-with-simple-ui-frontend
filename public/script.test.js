// public/script.test.js

describe('Calculator UI', () => {
  beforeAll(() => {
    // Set up the required DOM elements
    document.body.innerHTML = `
      <div id="display"></div>
      <div id="input"></div>
      <div class="buttons">
        <button class="clear">C</button>
        <button class="operator" data-action="divide">÷</button>
        <button class="operator" data-action="multiply">×</button>
        <button class="operator" data-action="subtract">-</button>
        <button class="number" data-value="7">7</button>
        <button class="number" data-value="8">8</button>
        <button class="number" data-value="9">9</button>
        <button class="operator" data-action="add">+</button>
        <button class="number" data-value="4">4</button>
        <button class="number" data-value="5">5</button>
        <button class="number" data-value="6">6</button>
        <button class="equals">=</button>
        <button class="number" data-value="1">1</button>
        <button class="number" data-value="2">2</button>
        <button class="number" data-value="3">3</button>
        <button class="number" data-value="0">0</button>
        <button class="decimal" data-value=".">.</button>
      </div>
    `;

    // Load the script; this attaches event listeners and initializes globals
    require('./script.js');
  });

  test('should perform addition and display the result', () => {
    // 7 + 3 = 10
    document.querySelector('button[data-value="7"]').click();
    document.querySelector('button[data-action="add"]').click();
    document.querySelector('button[data-value="3"]').click();
    document.querySelector('button.equals').click();

    expect(document.getElementById('display').textContent).toBe('10');
    // input shows the expression that was evaluated
    expect(document.getElementById('input').textContent).toBe('7 + 3');
  });

  test('should show "Error" when dividing by zero', () => {
    document.querySelector('button.clear').click();
    document.querySelector('button[data-value="8"]').click();
    document.querySelector('button[data-action="divide"]').click();
    document.querySelector('button[data-value="0"]').click();
    document.querySelector('button.equals').click();

    expect(document.getElementById('display').textContent).toBe('Error');
    expect(document.getElementById('input').textContent).toBe('8 ÷ 0');
  });

  test('should handle consecutive operators by computing the intermediate result', () => {
    document.querySelector('button.clear').click();
    document.querySelector('button[data-value="5"]').click();
    document.querySelector('button[data-action="add"]').click();
    document.querySelector('button[data-value="3"]').click();
    // Now press '-' without pressing '=' first
    document.querySelector('button[data-action="subtract"]').click();
    // At this point the intermediate 5+3=8 should be computed and displayed
    expect(document.getElementById('display').textContent).toBe('8');
    // input shows lastExpression from the computation (current behavior)
    expect(document.getElementById('input').textContent).toBe('3'); 

    // Continue with '- 2 =' to get final result
    document.querySelector('button[data-value="2"]').click();
    document.querySelector('button.equals').click();
    expect(document.getElementById('display').textContent).toBe('6');
    // input shows last expression before '=' (the '2' that was reset)
    expect(document.getElementById('input').textContent).toBe('2');
  });

  test('should clear the state and reset displays', () => {
    // Enter something first
    document.querySelector('button[data-value="9"]').click();
    document.querySelector('button[data-action="multiply"]').click();
    document.querySelector('button[data-value="5"]').click();
    // Now clear
    document.querySelector('button.clear').click();

    expect(document.getElementById('display').textContent).toBe('0');
    expect(document.getElementById('input').textContent).toBe('');
  });

  test('should ignore typing a second decimal point', () => {
    document.querySelector('button.clear').click();
    // Start with decimal
    document.querySelector('button.decimal').click();
    // Try another decimal – should be ignored
    document.querySelector('button.decimal').click();
    // Then add a digit
    document.querySelector('button[data-value="5"]').click();

    expect(document.getElementById('display').textContent).toBe('0.5');
    expect(document.getElementById('input').textContent).toBe('0.5');
  });
});