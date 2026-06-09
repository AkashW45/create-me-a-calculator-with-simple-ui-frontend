// In-memory state as per ADR-002
const state = {
  currentInput: '0',
  previousInput: null,
  operator: null,
  result: null,
  shouldResetDisplay: false,
  expression: '',
  lastExpression: ''
};

const display = document.getElementById('display');
const inputDisplay = document.getElementById('input');

function updateDisplay() {
  display.textContent = state.currentInput;
  // Update input display: show last expression if exists, else current expression
  if (state.lastExpression) {
    inputDisplay.textContent = state.lastExpression;
  } else {
    inputDisplay.textContent = state.expression;
  }
}

function handleNumber(value) {
  if (state.shouldResetDisplay) {
    state.currentInput = value;
    state.shouldResetDisplay = false;
    state.expression = value;
    state.lastExpression = '';
  } else {
    if (state.currentInput === '0' && value !== '.') {
      state.currentInput = value;
      state.expression = value;
    } else if (value === '.' && state.currentInput.includes('.')) {
      return;
    } else {
      state.currentInput += value;
      state.expression += value;
    }
  }
  updateDisplay();
}

function handleOperator(op) {
  if (state.operator && !state.shouldResetDisplay) {
    compute();
    state.expression = state.currentInput;
    state.lastExpression = '';
  }
  state.previousInput = state.currentInput;
  state.operator = op;
  state.shouldResetDisplay = true;
  const operatorSymbols = { 'add': ' + ', 'subtract': ' − ', 'multiply': ' × ', 'divide': ' ÷ ' };
  state.expression += operatorSymbols[op] || ' ' + op;
  updateDisplay();
}

function compute() {
  if (!state.operator || !state.previousInput) return;
  const prev = parseFloat(state.previousInput);
  const curr = parseFloat(state.currentInput);
  let result;
  switch (state.operator) {
    case 'add': result = prev + curr; break;
    case 'subtract': result = prev - curr; break;
    case 'multiply': result = prev * curr; break;
    case 'divide': result = curr !== 0 ? prev / curr : 'Error'; break;
    default: return;
  }
  state.lastExpression = state.expression;
  state.currentInput = String(result);
  state.expression = String(result);
  state.operator = null;
  state.previousInput = null;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function handleClear() {
  state.currentInput = '0';
  state.previousInput = null;
  state.operator = null;
  state.result = null;
  state.shouldResetDisplay = false;
  state.expression = '';
  state.lastExpression = '';
  updateDisplay();
}

// Event delegation for button clicks
const buttonsContainer = document.querySelector('.buttons');

// ADR-001: Apply CSS Grid layout to buttons for a flexible, maintainable grid
buttonsContainer.style.display = 'grid';
buttonsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
buttonsContainer.style.gridTemplateAreas = `
  "clear clear divide multiply"
  "seven eight nine subtract"
  "four five six add"
  "one two three equals"
  "zero zero decimal equals"
`;
// Ensure child button components have appropriate grid-area (already set in HTML if not, but this ensures a fallback)
// Note: HTML elements must have corresponding `data-area` or inline `grid-area` for this to work.

buttonsContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  if (button.classList.contains('number') || button.classList.contains('decimal')) {
    handleNumber(button.dataset.value);
  } else if (button.classList.contains('operator')) {
    handleOperator(button.dataset.action);
  } else if (button.classList.contains('equals')) {
    compute();
  } else if (button.classList.contains('clear')) {
    handleClear();
  }
});

// Keyboard support (optional but nice)
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9') {
    handleNumber(key);
  } else if (key === '.') {
    handleNumber('.');
  } else if (key === '+' || key === '-') {
    handleOperator(key === '+' ? 'add' : 'subtract');
  } else if (key === '*') {
    handleOperator('multiply');
  } else if (key === '/') {
    handleOperator('divide');
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    compute();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    handleClear();
  }
});
