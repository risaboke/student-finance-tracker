export const rules = {
    description: {
        pattern: /^(?! )(?!.*  )[a-zA-Z0-9_.,'&()\/\- ]{3,100}(?<! )$/,
        message: "Give your transaction a clear description so you can remember what the money went towards."
    },
    amount: {
    pattern: /^(?!0+$)(?:0|[1-9]\d*)(?:\.\d{1,2})?$/,
    message: "Enter a valid amount, e.g., 10.00 or 109.09. Every cent counts!."
    },
    category: {
    pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    message: "Choose a category that best describes where your money went."
    },
    date: {
    pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    message: "Enter the date as YYYY-MM-DD, e.g., 2026-01-15."
    },
    currency: {
        pattern: /^[A-Z]{3}$/,
        message: "Use a 3-letter currency code in capitals, e.g., KES"
    },
    duplicateWord: {
    pattern: /\b(\w+)\s+\1\b/i,
    message: "Looks like you repeated a word. Give that description another look!"
    },
    rate: {
        pattern:/^(0|[1-9]\d*)(\.\d{1,6})?$/,
        message: "Enter a number like 0.82 or 1230.4."
    },
};