let num1 = "";
let num2 = "";
let operator = "";
let displayValue = "0";

// Perform the calculation
async function calculate(op, num1, num2) {
  const opMap = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
  };

  // Fetch calculation response from AWS API Gateway
  const url = `https://7bo9n25hr3.execute-api.ap-southeast-2.amazonaws.com/Test/${opMap[op]}?num1=${num1}&num2=${num2}`;
  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Response:", response);
    console.log("Response JSON:", data);
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch");
    }
    const resultData = JSON.parse(data.body);
    return resultData.result;
  } catch (error) {
    console.error("Error during fetch:", error);
    alert("An error occurred: " + error.message);
    return null;
  }
}

// Clear the display and cached data
function clearAll() {
  displayValue = "0";
  num1 = num2 = operator = "";
}

// Return whether the first or second number input is active
function getActiveNumber() {
  return operator === "" ? num1 : num2;
}

// Updates the relevent number
function setValue(value) {
  if (operator === "") {
    num1 = value;
  } else {
    num2 = value;
  }
  displayValue = value;
}

// Add keyboard functionality
window.addEventListener("keydown", function (event) {
  console.log("Key pressed:", event.keyCode, event.shiftKey);
  let key = document.querySelector(`button[data-key='${event.keyCode}']`);

  if (event.shiftKey && event.keyCode === 56) {
    key = document.querySelector(`button[data-shift-key='42']`);
  }

  if (!key) {
    key = document.querySelector(`button[data-alt-key='${event.keyCode}']`);
  }

  if (key) {
    key.click();
  }
});

const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

// Main event listener for button input
buttons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    button.classList.add("button-pressed");
    setTimeout(() => button.classList.remove("button-pressed"), 200);
    const buttonText = event.target.textContent;
    console.log("Button clicked:", buttonText);
    let num = getActiveNumber();

    // Handle each button action
    if (buttonText === "C") {
      clearAll();
    } else if (buttonText === "=" && num1 !== "" && num2 !== "" && operator !== "") {
      console.log("Calculating:", { operator, num1, num2 });
      const result = await calculate(operator, num1, num2);
      console.log("Calculation result:", result);

      if (result !== null && result !== undefined) {
        displayValue = result.toString();
        num1 = displayValue;
        num2 = operator = "";
      } else {
        console.error("Calculation returned null or undefined");
      }
    } else if (buttonText === "+/-") {
      num = (parseFloat(num) * -1).toString();
      setValue(num);
    } else if (buttonText === "DEL") {
      num = num.slice(0, -1);
      setValue(num);
      displayValue = num || "0";
    } else if (/^[0-9]+$/.test(buttonText) || buttonText === ".") {
      if ((buttonText !== "." || !num.includes(".")) && num.length < 10) {
        num += buttonText;
      }
      setValue(num);
    } else if (/[+\-*/]/.test(buttonText)) {
      if (num2 !== "") {
        const result = await calculate(operator, num1, num2);
        console.log("Intermediate calculation result:", result);
        if (result !== null && result !== undefined) {
          displayValue = result.toString();
          num1 = displayValue;
          num2 = "";
        } else {
          console.error("Intermediate calculation returned null or undefined");
        }
      }
      operator = buttonText;
    }

    // Update the display
    if (displayValue.toString().length > 12) {
      display.textContent = parseFloat(displayValue).toExponential(6);
    } else {
      display.textContent = displayValue;
    }
  });
});
