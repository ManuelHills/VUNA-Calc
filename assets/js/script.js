var left = '';
var operator = '';
var right = '';

function appendToResult(value) {
    if (operator.length === 0) {
        left += value.toString();
    } else {
        right += value.toString();
    }
    updateResult();
}

function bracketToResult(value) {
    if (operator.length === 0) {
        left += value;
    } else {
        right += value;
    }
    updateResult();
}

function backspace() {
    if (right.length > 0) {
        right = right.slice(0, -1);
    } else if (operator.length > 0) {
        operator = '';
    } else if (left.length > 0) {
        left = left.slice(0, -1);
    }
    updateResult();
}

function operatorToResult(value) {
    if (left.length === 0) return;
    if (right.length > 0) {
        calculateResult();
    }
    operator = value;
    updateResult();
}

function clearResult() {
    left = '';
    right = '';
    operator = '';
    document.getElementById('word-result').innerHTML = '';
    document.getElementById('word-area').style.display = 'none';
    updateResult();
}

function calculateResult() {
    if (left.length === 0 || operator.length === 0 || right.length === 0) return;

    let result;
    const l = parseFloat(left);
    const r = parseFloat(right);

    switch (operator) {
        case '+': result = l + r; break;
        case '-': result = l - r; break;
        case '*': result = l * r; break;
        case '/': result = r !== 0 ? l / r : 'Error'; break;
        default: return;
    }

    left = result.toString();
    operator = '';
    right = '';
    updateResult();
}

function numberToWords(num) {
    if (num === 'Error') return 'Error';
    if (num === '') return '';

    const n = parseFloat(num);
    if (isNaN(n)) return '';
    if (n === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertGroup(val) {
        let res = '';
        if (val >= 100) {
            res += ones[Math.floor(val / 100)] + ' Hundred ';
            val %= 100;
        }
        if (val >= 10 && val <= 19) {
            res += teens[val - 10] + ' ';
        } else if (val >= 20) {
            res += tens[Math.floor(val / 10)] + (val % 10 !== 0 ? '-' + ones[val % 10] : '') + ' ';
        } else if (val > 0) {
            res += ones[val] + ' ';
        }
        return res.trim();
    }

    let sign = n < 0 ? 'Negative ' : '';
    let absN = Math.abs(n);
    let parts = absN.toString().split('.');
    let integerPart = parseInt(parts[0]);
    let decimalPart = parts[1];

    let wordArr = [];
    if (integerPart === 0) {
        wordArr.push('Zero');
    } else {
        let scaleIdx = 0;
        while (integerPart > 0) {
            let chunk = integerPart % 1000;
            if (chunk > 0) {
                let chunkWords = convertGroup(chunk);
                wordArr.unshift(chunkWords + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''));
            }
            integerPart = Math.floor(integerPart / 1000);
            scaleIdx++;
        }
    }

    let result = sign + wordArr.join(', ').trim();

    if (decimalPart) {
        result += ' Point';
        for (let digit of decimalPart) {
            result += ' ' + (digit === '0' ? 'Zero' : ones[parseInt(digit)]);
        }
    }

    return result.trim();
}

function updateResult() {
    const display = left + (operator ? ' ' + operator + ' ' : '') + right;
    document.getElementById('result').value = display || '0';

    const wordResult = document.getElementById('word-result');
    const wordArea = document.getElementById('word-area');

    if (left && !operator && !right) {
        wordResult.innerHTML = '<span class="small-label">Result in words</span><strong>' + numberToWords(left) + '</strong>';
        wordArea.style.display = 'flex';
    } else {
        wordResult.innerHTML = '';
        wordArea.style.display = 'none';
    }
    enableSpeakButton();
}

function speakResult() {
    const speakBtn = document.getElementById('speak-btn');
    const wordResultEl = document.getElementById('word-result');

    // Get text content only (strips the <span class="small-label"> part if needed)
    // Actually we just want the number part
    const words = wordResultEl.querySelector('strong')?.innerText || '';

    if (!words) return;

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        speakBtn.classList.remove('speaking');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(words);
    utterance.rate = 0.9;
    utterance.onstart = () => speakBtn.classList.add('speaking');
    utterance.onend = () => speakBtn.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
}

function enableSpeakButton() {
    const speakBtn = document.getElementById('speak-btn');
    if (!speakBtn) return;
    const hasContent = document.getElementById('word-result').innerHTML.trim().length > 0;
    speakBtn.disabled = !hasContent;
}

function numberToWords(num) {
  if (num === 0) return "zero";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const thousands = ["", "thousand", "million", "billion"];

  function convertHundreds(n) {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " hundred";
      n %= 100;
      if (n > 0) result += " ";
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += "-" + ones[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += ones[n];
    }

    return result;
  }

  // Handle negative numbers
  if (num < 0) {
    return "negative " + numberToWords(-num);
  }

  // Handle decimal numbers
  if (num % 1 !== 0) {
    let parts = num.toString().split(".");
    let wholePart = parseInt(parts[0]);
    let decimalPart = parts[1];

    let result = numberToWords(wholePart) + " point";
    for (let digit of decimalPart) {
      result += " " + ones[parseInt(digit)];
    }
    return result;
  }

  // Handle whole numbers
  if (num < 1000) {
    return convertHundreds(num);
  }

  let result = "";
  let thousandIndex = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk !== 0) {
      let chunkWords = convertHundreds(chunk);
      if (thousandIndex > 0) {
        chunkWords += " " + thousands[thousandIndex];
      }
      result = chunkWords + (result ? " " + result : "");
    }
    num = Math.floor(num / 1000);
    thousandIndex++;
  }

  return result;
}
// Add visual feedback for button presses
function addButtonFeedback() {
  const buttons = document.querySelectorAll(".calc-btn");
  buttons.forEach((button) => {
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// Initialize button feedback when page loads
document.addEventListener("DOMContentLoaded", function () {
  addButtonFeedback();

  // Add keyboard support
  document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (key >= "0" && key <= "9") {
      appendToResult(key);
    } else if (key === ".") {
      appendToResult(".");
    } else if (key === "+") {
      operatorToResult("+");
    } else if (key === "-") {
      operatorToResult("-");
    } else if (key === "*") {
      operatorToResult("*");
    } else if (key === "/") {
      event.preventDefault(); // Prevent browser search
      operatorToResult("/");
    } else if (key === "Enter" || key === "=") {
      calculateResult();
    } else if (key === "Escape" || key === "c" || key === "C") {
      clearResult();
    } else if (key === "Backspace") {
      backspace();
    }
  });
});

// Enhanced error handling
function showError(message) {
  const wordResult = document.getElementById("word-result");
  wordResult.innerHTML = `<span style="color: #e74c3c;">Error: ${message}</span>`;
  setTimeout(() => {
    wordResult.innerHTML = "";
  }, 3000);
}

// Improved calculateResult with better error handling
function calculateResultEnhanced() {
  if (left && operator && right) {
    let leftNum = parseFloat(left);
    let rightNum = parseFloat(right);

    if (isNaN(leftNum) || isNaN(rightNum)) {
      showError("Invalid number");
      return;
    }

    let result;

    switch (operator) {
      case "+":
        result = leftNum + rightNum;
        break;
      case "-":
        result = leftNum - rightNum;
        break;
      case "*":
        result = leftNum * rightNum;
        break;
      case "/":
        if (rightNum === 0) {
          showError("Cannot divide by zero");
          return;
        }
        result = leftNum / rightNum;
        break;
      default:
        return;
    }

    // Round to avoid floating point precision issues
    result = Math.round(result * 1000000000) / 1000000000;

    // Update display and reset for next calculation
    left = result.toString();
    operator = "";
    right = "";
    updateResult();
  }
}

// Replace the original calculateResult function
calculateResult = calculateResultEnhanced;
