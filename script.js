
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { A: 2, B: 4, C: 6, D: 8 };
const SYMBOL_VALUES = { A: 5, B: 4, C: 3, D: 2 };

let balance = 0;

const depositMoney = () => {
    const depositInput = document.getElementById("deposit");
    const amount = parseFloat(depositInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid deposit amount. Try again.");
        return;
    }

    balance += amount;
    updateBalance();
    depositInput.value = "";
};

const updateBalance = () => {
    document.getElementById("balance").innerText = balance;
};

const spinSlot = () => {
    const lines = parseInt(document.getElementById("lines").value);
    const bet = parseFloat(document.getElementById("bet").value);

    if (isNaN(lines) || lines < 1 || lines > ROWS) {
        alert("Please enter valid number of lines (1-3).");
        return;
    }

    if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
        alert("Invalid bet amount.");
        return;
    }

    balance -= bet * lines;
    updateBalance();

    const reels = spin();
    const rows = transpose(reels);

    animateSlots();

    setTimeout(() => {
        displaySlots(rows);
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        updateBalance();
        showResultMessage(winnings);
    }, 600); // Match animation duration
};

const spin = () => {
 //Convert the SYMBOLS_COUNT object into an array of symbols
    let symbols = Object.entries(SYMBOLS_COUNT);
    console.log("Step 1 - Object.entries(SYMBOLS_COUNT):", symbols);

    // Flatten the array of symbols by repeating each symbol based on its count
    symbols = symbols.flatMap(([symbol, count]) => Array(count).fill(symbol));
    console.log("Step 2 - After flatMap():", symbols);

    // Create a 2D array of size COLS x ROWS, randomly selecting symbols from the symbols array
    const result = Array.from({ length: COLS }, () =>
        Array.from({ length: ROWS }, () =>
            symbols.splice(Math.floor(Math.random() * symbols.length), 1)[0]
        )
    );
    console.log("Step 3 - Final 2D array:", result);

    return result;
};


const transpose = (matrix) => {
    // matrix[0].map() iterates over each element in the first row.
    // We don't need the actual element, only its index, so we use a placeholder (e.g., 'unused').
    return matrix[0].map((unused, columnIndex) => {
      // For each columnIndex, we build a new array by taking the element at that index from each row.
      return matrix.map((row) => row[columnIndex]);
    });
  };
  

const animateSlots = () => {
    document.querySelectorAll(".slot-row span").forEach(slot => {
        slot.classList.add("spin-animation");
        setTimeout(() => slot.classList.remove("spin-animation"), 600);
    });
};

const displaySlots = (rows) => {
    rows.forEach((row, i) => {
        row.forEach((symbol, j) => {
            document.getElementById(`r${i + 1}c${j + 1}`).innerText = symbol;
        });
    });
};

const getWinnings = (rows, bet, lines) => {
    return rows.slice(0, lines).reduce((winnings, row) => 
        row.every(symbol => symbol === row[0]) ? winnings + bet * SYMBOL_VALUES[row[0]] : winnings, 0);
};

const showResultMessage = (winnings) => {
    const messageEl = document.getElementById("message");
    messageEl.innerText = winnings > 0 ? `You won $${winnings}! 🎉` : "You lost! Try again.";
    messageEl.style.color = winnings > 0 ? "green" : "red";

    if (balance <= 0) {
        alert("You ran out of money! Please deposit more to continue.");
    }
};




