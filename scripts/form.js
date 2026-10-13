import {rules} from './validators.js';

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const descriptionError = document.getElementById('description-error');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amount-error');
const categoryInput = document.getElementById('category');
const categoryError = document.getElementById('category-error');
const dateInput = document.getElementById('date');
const dateError = document.getElementById('date-error');

let records = [];
function createRecord() {
    const rightNow = new Date();
    const timestamp = rightNow.toISOString();
    const milliseconds = Date.now();
    const newId = 'txn_' + milliseconds;
    const amountAsNumber = Number(amountInput.value);
    const newRecord = {
        id: newId,
        description: descriptionInput.value,
        amount: amountAsNumber,
        category: categoryInput.value,
        date: dateInput.value,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    return newRecord;
}

function validateDescription() {
    const text = descriptionInput.value;
    const matchesRule = rules.description.pattern.test(text);
    const hasRepeatedWord = rules.duplicateWord.pattern.test(text);
    let isValid = true;

    if (matchesRule === false) {
        descriptionError.textContent = rules.description.message;
        isValid = false;
    } else if (hasRepeatedWord === true) {
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

function validateAmount() {
    if (!rules.amount.pattern.test(amountInput.value)) {
        amountError.textContent = rules.amount.message;
        return false;
    }
    amountError.textContent = '';
    return true;
}

function handleAmountTyping() {
    validateAmount();
}
amountInput.addEventListener('input', handleAmountTyping);
form.addEventListener('submit', handleSubmit);

function validateCategory() {
    const text = categoryInput.value;
    const matchesRule = rules.category.pattern.test(text);
    let isValid = true;

    if (matchesRule === false) {
        categoryError.textContent = rules.category.message;
        isValid = false;
    } else {
        categoryError.textContent = '';
    }
    return isValid;
}
function handleCategoryTyping() {
    validateCategory();
}
categoryInput.addEventListener('input', handleCategoryTyping);

function validateDate() {
    const text = dateInput.value;
    const matchesRule = rules.date.pattern.test(text);
    let isValid = true;

    if (matchesRule === false) {
        dateError.textContent = rules.date.message;
        isValid = false;
    } else {
        dateError.textContent = '';
    }
    return isValid;
}
function handleDateTyping() {
    validateDate();
}
dateInput.addEventListener('input', handleDateTyping);

function clearForm() {
    form.reset();
    descriptionError.textContent = '';
    amountError.textContent = '';
    categoryError.textContent = '';
    dateError.textContent = '';
}

function handleSubmit(event) {
    event.preventDefault();
    const amountPerf = validateAmount();
    const descriptionPerf = validateDescription();
    const categoryPerf = validateCategory();
    const datePerf = validateDate();

    if (amountPerf === true && descriptionPerf === true && categoryPerf === true && datePerf === true) {
        const newRecord = createRecord();
        records.push(newRecord);
        console.log(records);
        clearForm();
    } else {
        console.log('Your form is invalid');
    }
}