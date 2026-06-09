/**
 * @jest-environment jsdom
 */

// Setup the DOM before requiring the script
beforeAll(() => {
  document.body.innerHTML = `
    <div id="display">0</div>
    <div id="expression"></div>
    <div class="buttons">
      <button class="number" data-value="1">1</button>
      <button class="number" data-value="2">2</button>
      <button class="number" data-value="3">3</button>
      <button class="number" data-value="4">4</button>
      <button class="number" data-value="5">5</button>
      <button class="number" data-value="6">6</button>
      <button class="number" data-value="7">7</button>
      <button class="number" data-value="8">8</button>
      <button class="number" data-value="9">9</button>
      <button class="number" data-value="0">0</button>
      <button class="decimal" data-value=".">.</button>
      <button class="operator" data-action="add">+</button>
      <button class="operator" data-action="subtract">−</button>
      <button class="operator" data-action="multiply">×</button>
      <button class="operator" data-action="divide">÷</button>
      <button class="equals">=</button>
      <button class="clear">C</button>
    </div>
  `;
});

require('../public/script');

describe('Calculator integration tests', () => {
  const getDisplay = () => document.getElementById('display');
  const getExpression = () => document.getElementById('expression');

  beforeEach(() => {
    // Reset state by clicking clear before each test
    document.querySelector('.clear').click();
  });

  test('happy path: basic input, operator, compute, and expression display', () => {
    // Input first number
    document.querySelector('[data-value="3"]').click();
    expect(getDisplay().textContent).toBe('3');
    expect(getExpression().textContent).toBe('3');

    // Operator
    document.querySelector('[data-action="add"]').click();
    // After operator, expression resets because shouldResetDisplay will be set,
    // then new number input will overwrite expression.
    // So now expression is '3 + ' according to the code? Let's check:
    // handleOperator sets expression to currentInput ('3') then appends ' + '.
    expect(getExpression().textContent).toBe('3 + ');

    // Second number
    document.querySelector('[data-value="5"]').click();
    expect(getDisplay().textContent).toBe('5');
    // expression is '5' because reset after operator
    expect(getExpression().textContent).toBe('5');

    // Compute
    document.querySelector('.equals').click();
    expect(getDisplay().textContent).toBe('8');
    // lastExpression should be '3 + 5'
    expect(getExpression().textContent).toBe('3 + 5');
  });

  test('edge case: operator chaining computes intermediate result', () => {
    document.querySelector('[data-value="2"]').click();
    document.querySelector('[data-action="add"]').click();
    document.querySelector('[data-value="3"]').click();
    document.querySelector('[data-action="subtract"]').click();

    // After subtraction operator, compute() is triggered because previous operator exists
    // and shouldResetDisplay is false. That computes 2+3=5.
    // Then expression is set to the result '5', then the new operator appended: '5 − '.
    expect(getDisplay().textContent).toBe('5');
    expect(getExpression().textContent).toBe('5 − ');
  });

  test('edge case: division by zero displays Error and shows last expression', () => {
    document.querySelector('[data-value="5"]').click();
    document.querySelector('[data-action="divide"]').click();
    document.querySelector('[data-value="0"]').click();
    document.querySelector('.equals').click();

    expect(getDisplay().textContent).toBe('Error');
    // lastExpression should be '5 ÷ 0'
    expect(getExpression().textContent).toBe('5 ÷ 0');
  });

  test('edge case: clear resets display and expression', () => {
    document.querySelector('[data-value="9"]').click();
    document.querySelector('.clear').click();

    expect(getDisplay().textContent).toBe('0');
    expect(getExpression().textContent).toBe('');
  });

  test('edge case: multiple decimal inputs are ignored', () => {
    document.querySelector('[data-value="1"]').click();
    document.querySelector('.decimal').click();
    document.querySelector('.decimal').click(); // should be ignored

    expect(getDisplay().textContent).toBe('1.');
  });

  test('keyboard support: Enter key computes expression', () => {
    document.querySelector('[data-value="4"]').click();
    document.querySelector('[data-action="multiply"]').click();
    document.querySelector('[data-value="2"]').click();

    // Simulate Enter key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    expect(getDisplay().textContent).toBe('8');
    expect(getExpression().textContent).toBe('4 × 2');
  });
});