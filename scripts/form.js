import {rules} from './validators.js';

const form = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amount-error');
const descriptionInput = document.getElementById('description');
const descriptionError = document.getElementById('description-error');


function validateAmount() {
    if (!rules.amount.pattern.test(amountInput.value)) {
        amountError.textContent = rules.amount.message;
        return false;
    }
    amountError.textContent = '';
    return true;
}
function handleSubmit(event) {
    event.preventDefault();
    const amountPerf = validateAmount();
    const descriptionPerf = validateDescription();

    if (amountPerf === true && descriptionPerf ==true) {
        console.log('Your form is valid and ready to save');
    } else {
        console.log('Your form is invalid');
    }
}
function handleAmountTyping() {
    validateAmount();
}
amountInput.addEventListener('input', handleAmountTyping);
form.addEventListener('submit', handleSubmit);

function validateDescription() {
    const text = descriptionInput.value;
    const matchesRule = rules.description.pattern.test(text);
    const hasRepeateWord = rules.duplicateWord.pattern.test(text);
    let isValid = true;

    if (matchesRule === false) {
        descriptionError.textContent = rules.description.message;
        isValid = false;
    } else if (hasRepeateWord === true) {
        descriptionError.textContent = rules.duplicateWord.message;
    } else {
        descriptionError.textContent = '';
    }
    return isValid;
}
function handleDescriptionTyping() {
    validateDescription();
}
descriptionInput.addEventListener('input', handleDescriptionTyping);