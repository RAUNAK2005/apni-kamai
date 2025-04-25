// Dark Mode Toggle with localStorage persistence
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    darkModeToggle.textContent = '🌞';
  } else {
    document.body.classList.remove('light-mode');
    darkModeToggle.textContent = '🌙';
  }
  
  // Toggle theme when button is clicked
  darkModeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      darkModeToggle.textContent = '🌙';
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      darkModeToggle.textContent = '🌞';
    }
  });
});

// Loan Calculator
function calculateLoan() {
  const amount = parseFloat(document.getElementById('loan-amount').value);
  const rate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;
  const term = parseFloat(document.getElementById('loan-term').value) * 12;

  if (!amount || !rate || !term) {
    alert('Please fill in all fields');
    return;
  }

  const monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -term));
  const totalInterest = monthlyPayment * term - amount;

  document.getElementById('monthly-payment').textContent = `₹${monthlyPayment.toFixed(2)}`;
  document.getElementById('total-interest').textContent = `₹${totalInterest.toFixed(2)}`;

  const ctx = document.getElementById('loanChart').getContext('2d');
  if (window.loanChart) window.loanChart.destroy();
  window.loanChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Principal', 'Interest'],
      datasets: [{ data: [amount, totalInterest], backgroundColor: ['#00ffcc', '#ff00cc'] }]
    },
    options: { responsive: true }
  });
}

// SIP Calculator
function calculateSIP() {
  const amount = parseFloat(document.getElementById('sip-amount').value);
  const rate = parseFloat(document.getElementById('sip-rate').value) / 100 / 12;
  const term = parseFloat(document.getElementById('sip-term').value) * 12;

  if (!amount || !rate || !term) {
    alert('Please fill in all fields');
    return;
  }

  const totalInvested = amount * term;
  const totalValue = amount * ((Math.pow(1 + rate, term) - 1) / rate) * (1 + rate);
  const wealthGained = totalValue - totalInvested;

  document.getElementById('sip-invested').textContent = `₹${totalInvested.toFixed(2)}`;
  document.getElementById('sip-gained').textContent = `₹${wealthGained.toFixed(2)}`;
  document.getElementById('sip-total').textContent = `₹${totalValue.toFixed(2)}`;

  const ctx = document.getElementById('sipChart').getContext('2d');
  if (window.sipChart) window.sipChart.destroy();
  window.sipChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Invested', 'Gained'],
      datasets: [{ data: [totalInvested, wealthGained], backgroundColor: ['#00ffcc', '#ffcc00'] }]
    },
    options: { responsive: true }
  });
}

// MF Calculator
function calculateMF() {
  const amount = parseFloat(document.getElementById('mf-amount').value);
  const rate = parseFloat(document.getElementById('mf-rate').value) / 100;
  const term = parseFloat(document.getElementById('mf-term').value);

  if (!amount || !rate || !term) {
    alert('Please fill in all fields');
    return;
  }

  const totalValue = amount * Math.pow(1 + rate, term);
  const growth = totalValue - amount;

  document.getElementById('mf-invested').textContent = `₹${amount.toFixed(2)}`;
  document.getElementById('mf-growth').textContent = `₹${growth.toFixed(2)}`;
  document.getElementById('mf-total').textContent = `₹${totalValue.toFixed(2)}`;

  const ctx = document.getElementById('mfChart').getContext('2d');
  if (window.mfChart) window.mfChart.destroy();
  window.mfChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Invested', 'Growth'],
      datasets: [{ data: [amount, growth], backgroundColor: ['#00ffcc', '#3333ff'] }]
    },
    options: { responsive: true }
  });
}

// Ask Rancho Function
async function askRancho() {
  const ranchoInput = document.getElementById('rancho-input');
  const ranchoResponse = document.getElementById('rancho-response');
  const message = ranchoInput.value.trim();

  if (!message) {
    ranchoResponse.innerHTML = '<p><strong>Rancho:</strong> Please ask me something!</p>';
    return;
  }

  ranchoResponse.innerHTML = '<p><strong>You:</strong> ' + message + '</p>';
  ranchoInput.value = '';

  try {
    const response = await fetch('/rancho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    ranchoResponse.innerHTML += `<p><strong>Rancho:</strong> ${data.reply}</p>`;
  } catch (error) {
    ranchoResponse.innerHTML += `<p><strong>Rancho:</strong> Something went wrong! Try again?</p>`;
  }
}

// Add Enter key support for the search bar
document.addEventListener('DOMContentLoaded', () => {
  const ranchoInput = document.getElementById('rancho-input');
  if (ranchoInput) {
    ranchoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        askRancho();
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for input groups
    document.querySelectorAll('.input-group').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Initialize calculator-specific elements
    initializeCalculator();
});

function initializeCalculator() {
    // Reset form and hide results on page load
    resetCalculator();
    
    // Add event listeners for Enter key on inputs
    document.querySelectorAll('.calculator-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateSIP(); // Change this function name for each calculator
            }
        });
    });
}