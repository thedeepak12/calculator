const display = document.getElementById("display");

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        const result = operate(display.value);
        display.value = result;
    }
    catch (error) {
        display.value = "Error";
    }
}

function operate(expression) {
    expression = expression.replace(/\s/g, '');
    
    if (!expression || !/^[0-9+\-*/.]+$/.test(expression)) {
        throw new Error("Invalid input");
    }

    const numbers = [];
    const operators = [];
    let currentNumber = '';

    function applyOperator() {
        if (numbers.length < 2 || operators.length < 1) {
            throw new Error("Invalid expression");
        }

        const b = numbers.pop();
        const a = numbers.pop();
        const op = operators.pop();

        switch (op) {
            case '+':
                numbers.push(a + b);
                break;
            case '-':
                numbers.push(a - b);
                break;
            case '*':
                numbers.push(a * b);
                break;
            case '/': 
                if (b === 0) throw new Error("Division by zero");
                numbers.push(a / b); 
                break;
        }
    }

    function precedence(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    }

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (/\d|\./.test(char)) {
            currentNumber += char;
        } else if ('+-*/'.includes(char)) {
            if (currentNumber) {
                numbers.push(parseFloat(currentNumber));
                currentNumber = '';
            }
            
            while (operators.length > 0 && 
                   precedence(operators[operators.length - 1]) >= precedence(char)) {
                applyOperator();
            }
            operators.push(char);
        } else {
            throw new Error("Invalid character");
        }
    }

    if (currentNumber) {
        numbers.push(parseFloat(currentNumber));
    }

    while (operators.length > 0) {
        applyOperator();
    }

    if (numbers.length !== 1) {
        throw new Error("Invalid expression");
    }

    return numbers[0];
}