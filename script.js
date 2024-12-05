let currentNumber = 0;
let factorPairs = [];
let guessedFactors = [];
let incorrectAttempts = 0;
const maxAttempts = 4;

function nextNumber() {
    // Generate a random number between 1 and 100
    currentNumber = Math.floor(Math.random() * 100) + 1;
    factorPairs = calculateFactors(currentNumber);
    guessedFactors = [];
    incorrectAttempts = 0;
    updateUI();
}

function calculateFactors(number) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            factors.push([i, number / i]);
        }
    }
    return factors;
}

function updateUI() {
    document.getElementById('current-number').innerText = currentNumber;
    document.getElementById('factors-container').innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('factor1').value = '';
    document.getElementById('factor2').value = '';
    document.getElementById('remaining-attempts').innerText = maxAttempts - incorrectAttempts;
}

function checkFactors() {
    const factor1 = parseInt(document.getElementById('factor1').value);
    const factor2 = parseInt(document.getElementById('factor2').value);
    const feedback = document.getElementById('feedback');

    if (isNaN(factor1) || isNaN(factor2)) {
        feedback.innerText = 'Please enter valid numbers.';
        feedback.className = 'feedback-error';
        return;
    }

    const isRepeatedPair = guessedFactors.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    if (isRepeatedPair) {
        feedback.innerText = 'You have already entered this combination. Try another one.';
        feedback.className = 'feedback-error';
        return;
    }

    const isValidPair = factorPairs.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    if (!isValidPair) {
        incorrectAttempts++;
        guessedFactors.push([factor1, factor2]); // Record incorrect combination
        feedback.innerText = 'This combination is not valid. Try again.';
        feedback.className = 'feedback-error';

        // Update remaining attempts
        document.getElementById('remaining-attempts').innerText = maxAttempts - incorrectAttempts;

        // Show hint after 2 incorrect attempts
        if (incorrectAttempts === 2) {
            const remaining = factorPairs.length - guessedFactors.filter(pair =>
                factorPairs.some(validPair =>
                    (pair[0] === validPair[0] && pair[1] === validPair[1]) ||
                    (pair[0] === validPair[1] && pair[1] === validPair[0])
                )
            ).length;

            feedback.innerText += ` Hint: There are ${remaining} remaining factor combinations.`;
            feedback.className = 'feedback-hint';
        }

        // Show missing factors after 4 incorrect attempts
        if (incorrectAttempts >= maxAttempts) {
            const remainingFactors = factorPairs.filter(pair => 
                !guessedFactors.some(guessed =>
                    (pair[0] === guessed[0] && pair[1] === guessed[1]) ||
                    (pair[0] === guessed[1] && pair[1] === guessed[0])
                )
            );

            feedback.innerText = `You have reached ${maxAttempts} incorrect attempts. The missing factors are: ${remainingFactors.map(pair => `${pair[0]} x ${pair[1]}`).join(', ')}. Moving to the next number...`;
            feedback.className = 'feedback-error';

            setTimeout(nextNumber, 3000);
        }
        return;
    }

    // Record correct combination
    guessedFactors.push([factor1, factor2]);
    const factorContainer = document.getElementById('factors-container');
    const factorPairElement = document.createElement('div');
    factorPairElement.className = 'factor-pair';
    factorPairElement.innerText = `${factor1} x ${factor2} = ${currentNumber}`;
    factorContainer.appendChild(factorPairElement);

    feedback.innerText = 'Correct combination!';
    feedback.className = 'feedback-success';

    // Check if all combinations have been guessed
    if (guessedFactors.filter(pair =>
        factorPairs.some(validPair =>
            (pair[0] === validPair[0] && pair[1] === validPair[1]) ||
            (pair[0] === validPair[1] && pair[1] === validPair[0])
        )
    ).length === factorPairs.length) {
        feedback.innerText = 'You found all the factor combinations! Moving to the next number...';
        feedback.className = 'feedback-success';

        setTimeout(nextNumber, 3000);
    }

    // Clear input fields
    document.getElementById('factor1').value = '';
    document.getElementById('factor2').value = '';
}

// Start the game with a number
nextNumber();