import {rules} from './validators.js';

const form = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amount-error');

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
    if (amountPerf === true) {
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