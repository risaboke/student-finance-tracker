export const rules = {
    description: {
        pattern: /^(?! )(?!.*  )[a-zA-Z0-9_.,'&()\/\- ]{3,100}(?<! )$/,
        message: "Give your transaction a clear description, between 3 and 100 characters. This helps you remember what you spent your money on."
    },
    amount: {
    pattern: /^(?!0+$)(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.
    message:
    },
    category: {
    pattern:
    message:
    },
    date: {
    pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    message: "Use the format YYYY-MM-DD."
    },
    duplicateWord: {
    pattern:
    message:
    }
};