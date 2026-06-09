const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;
const HOST = '0.0.0.0';

// Health check endpoint - must respond 200 with non-empty body
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route — serves the calculator UI with fixed button layout and input display
// Inline HTML removed; the static file middleware now serves public/index.html.
// Ensure public/index.html contains only markup and <script src="script.js">.
// Public/script.js must implement all calculator logic with a single delegated click handler.
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});    .buttons button[data-action="backspace"] {
      background: #e0e0e0;
    }
    .span2 {
      grid-column: span 2;
    }
  </style>
</head>
<body>
<div class="calculator" id="app">
  <div class="display">
    <div class="input-display" id="inputDisplay"></div>
    <div class="result-display" id="resultDisplay">0</div>
  </div>
  <div class="buttons" id="buttonPanel">
    <button data-action="clear" class="clear span2">AC</button>
    <button data-action="backspace">⌫</button>
    <button data-action="divide" class="operator">÷</button>
    <button data-action="number" data-value="7">7</button>
    <button data-action="number" data-value="8">8</button>
    <button data-action="number" data-value="9">9</button>
    <button data-action="multiply" class="operator">×</button>
    <button data-action="number" data-value="4">4</button>
    <button data-action="number" data-value="5">5</button>
    <button data-action="number" data-value="6">6</button>
    <button data-action="subtract" class="operator">−</button>
    <button data-action="number" data-value="1">1</button>
    <button data-action="number" data-value="2">2</button>
    <button data-action="number" data-value="3">3</button>
    <button data-action="add" class="operator">+</button>
    <button data-action="number" data-value="0" class="span2">0</button>
    <button data-action="decimal">.</button>
    <button data-action="equals" class="equals">=</button>
  </div>
</div>
<script>
(function() {
  let input = '';
  let result = '0';
  const inputDisplay = document.getElementById('inputDisplay');
  const resultDisplay = document.getElementById('resultDisplay');

  function updateDisplay() {
    inputDisplay.textContent = input || ' ';
    resultDisplay.textContent = result;
  }

  function handleNumber(value) {
    input += value;
    result = input;
    updateDisplay();
  }

  function handleOperator(op) {
    const lastChar = input.slice(-1);
    if ('+-*/'.includes(lastChar)) {
      input = input.slice(0, -1);
    }
    input += op;
    result = input;
    updateDisplay();
  }

  function calculate() {
    try {
      const sanitized = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      let computed = Function('"use strict"; return (' + sanitized + ')')();
      if (!Number.isFinite(computed)) throw new Error('Invalid');
      result = computed.toString();
      input = result;
    } catch (e) {
      result = 'Error';
    }
    updateDisplay();
  }

  document.getElementById('buttonPanel').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'number') {
      handleNumber(btn.dataset.value);
    } else if (action === 'add') {
      handleOperator('+');
    } else if (action === 'subtract') {
      handleOperator('-');
    } else if (action === 'multiply') {
      handleOperator('*');
    } else if (action === 'divide') {
      handleOperator('/');
    } else if (action === 'decimal') {
      if (!input.endsWith('.')) {
        handleNumber('.');
      }
    } else if (action === 'equals') {
      calculate();
    } else if (action === 'clear') {
      input = '';
      result = '0';
      updateDisplay();
    } else if (action === 'backspace') {
      input = input.slice(0, -1);
      result = input || '0';
      updateDisplay();
    }
  });
})();
function handleEquals() {
  calculate();
}

document.querySelector('[data-action="equals"]').addEventListener('click', handleEquals);

</script>
</body>
</html>`;
  res.send(html);
});

app.listen(PORT, HOST, () => {
  console.log(`Calculator server running on http://${HOST}:${PORT}`);
});
