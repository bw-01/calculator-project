let num1 = "";
let num2 = "";
let operator = "";
let displayValue = "0";

function operate(op, n1, n2) {
  if (op === "+") {
    result = n1 + n2;
  } else if (op === "-") {
    result = n1 - n2;
  } else if (op === "*") {
    result = n1 * n2;
  } else if (op === "/") {
    result = n2 !== 0 ? n1 / n2 : "CPU SAYS NO!";
  }
  return typeof result === "number" ? parseFloat(result.toFixed(10)) : result;
}

function clearAll() {
  displayValue = "0";
  num1 = num2 = operator = "";
}

const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const buttonText = event.target.textContent;

    if (buttonText === "C") {
      clearAll();
    } else if (buttonText === "=" && num1 !== "" && num2 !== "" && operator !== "") {
      displayValue = operate(operator, parseFloat(num1), parseFloat(num2));
      num1 = displayValue.toString();
      num2 = operator = "";
    } else if (/^[0-9]+$/.test(buttonText) || buttonText === ".") {
      if (operator === "") {
        if ((buttonText != "." || !num1.includes(".")) && num1.length < 10) {
          num1 += buttonText;
          displayValue = num1;
        }
      } else {
        if ((buttonText != "." || !num2.includes(".")) && num2.length < 10) {
          num2 += buttonText;
          displayValue = num2;
        }
      }
    } else if (/[+\-*/]/.test(buttonText)) {
      if (num2 !== "") {
        displayValue = operate(operator, parseFloat(num1), parseFloat(num2));
        num1 = displayValue.toString();
        num2 = "";
      }
      operator = buttonText;
    }

    if (displayValue.toString().length > 12) {
      display.textContent = parseFloat(displayValue).toExponential(6);
    } else {
      display.textContent = displayValue;
    }
    
  });
});
