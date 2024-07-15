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

function getActiveNumber() {
  return operator === "" ? num1 : num2;
}

function setValue(value) {
  operator === "" ? (num1 = value) : (num2 = value);
  displayValue = value;
}

const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const buttonText = event.target.textContent;
    let num = getActiveNumber();

    if (buttonText === "C") {
      clearAll();
    } else if (buttonText === "=" && num1 !== "" && num2 !== "" && operator !== "") {
      displayValue = operate(operator, parseFloat(num1), parseFloat(num2));
      num1 = displayValue.toString();
      num2 = operator = "";
    } else if (buttonText === "+/-") {
      num = -num;
      setValue(num);
    } else if (/^[0-9]+$/.test(buttonText) || buttonText === ".") {
      if ((buttonText !== "." || !num.includes(".")) && num.length < 10) {
        num += buttonText;
      }
      setValue(num);
    } else if (/[+\-*/]/.test(buttonText)) {
      if (num2 !== "") {
        displayValue = operate(operator, parseFloat(num1), parseFloat(num2));
        num1 = displayValue.toString();
        num2 = "";
      }
      operator = buttonText;
    } else if (buttonText === "DEL") {
      num = num.slice(0, -1);
      setValue(num);
      displayValue = num || "0";
    }

    // Update the display
    if (displayValue.toString().length > 12) {
      display.textContent = parseFloat(displayValue).toExponential(6);
    } else {
      display.textContent = displayValue;
    }
  });
});
