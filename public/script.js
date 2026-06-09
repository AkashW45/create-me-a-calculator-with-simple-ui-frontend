// In-memory state as per ADR-002
const state = {
  currentInput: '0',
  previousInput: null,
  operator: null,
  result: null,
  shouldResetDisplay: false
};

const display = document.getElementById('display');

function updateDisplay() {
  display.textContent = state.currentInput;
}

function handleNumber(value) {
  if (state.shouldResetDisplay) {
    state.currentInput = value;
    state.shouldResetDisplay = false;
  } else {
    if (state.currentInput === '0' && value !== '.') {
      state.currentInput = value;
    } else if (value === '.' && state.currentInput.includes('.')) {
      return;
    } else {
      state.currentInput += value;
    }
  }
  updateDisplay();
}

function handleOperator(op) {
  if (state.operator && !state.shouldResetDisplay) {
    compute();
  }
  state.previousInput = state.currentInput;
  state.operator = op;
  state.shouldResetDisplay = true;
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
  state.currentInput = String(result);
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
  updateDisplay();
}

// Event delegation for button clicks
const buttonsContainer = document.querySelector('.buttons');
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
