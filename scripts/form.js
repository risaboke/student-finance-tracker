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
const recordsBody = document.getElementById('records-body');
const sortDescriptionButton = document.getElementById('sort-description');
const sortAmountButton = document.getElementById('sort-amount');
const sortCategoryButton = document.getElementById('sort-category');
const sortDateButton = document.getElementById('sort-date');
const searchInput = document.getElementById('search-input');
const searchCaseBox = document.getElementById('search-case');
const searchStatus = document.getElementById('search-status');

let records = [];
let sortField = '';
let sortDirection = 'asc';
let searchRegex = null;

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

function compareRecords(a, b) {
    let result = 0;
    if (sortField === 'amount') {
        result = a.amount - b.amount;
    } else {
        result = a[sortField].localeCompare(b[sortField]);
    }
    if (sortDirection === 'desc') {
        result = result * -1;
    }
    return result;
}
function sortRecords(field) {
    if (sortField === field) {
        if (sortDirection === 'asc') {
            sortDirection = 'desc';
        } else {
            sortDirection = 'asc';
        }
    } else {
        sortField = field;
        sortDirection = 'asc';
    }
    records.sort(compareRecords);
    renderTable();
}

function handleSortDescription() {
    sortRecords('description');
}
function handleSortAmount() {
    sortRecords('amount');
}
function handleSortDate() {
    sortRecords('date');
}
sortDescriptionButton.addEventListener('click', handleSortDescription);
sortAmountButton.addEventListener('click', handleSortAmount);
sortDateButton.addEventListener('click', handleSortDate);

function handleSortCategory() {
    sortRecords('category');
}
sortCategoryButton.addEventListener('click', handleSortCategory);

function compileRegex(text, flags) {
    let regex = null;
    if (text!== '') {
        try {
            regex = new RegExp(text, flags);
        } catch (error) {
            regex = null;
        }
    }
    return regex;
}

function recordMatchesSearch(record) {
    if (searchRegex === null) {
        return true;
    }
    const descriptionMatch = searchRegex.test(record.description);
    const categoryMatch = searchRegex.test(record.category);
    const dateMatch = searchRegex.test(record.date);
    const amountMatch = searchRegex.test(String(record.amount));

    return descriptionMatch || categoryMatch || dateMatch || amountMatch;
}

function handleSearch() {
    const text = searchInput.value;

    let flags = 'i';
    if (searchCaseBox.checked === true) {
        flags = '';
    }

    const regex = compileRegex(text, flags);

    if (text !== '' && regex === null) {
        searchStatus.textContent = 'That pattern is not valid yet. Check your brackets.';
    } else {
        searchStatus.textContent = '';
    }
    searchRegex = regex;
    renderTable();
} 
searchInput.addEventListener('input', handleSearch);
searchCaseBox.addEventListener('change', handleSearch);

function fillCell(cell, value) {
    const text = String(value);
    let match = null;

    if (searchRegex !== null) {
        match = searchRegex.exec(text);
    }
    if (match === null || match[0] === '') {
        cell.textContent = text;
    } else {
        const before = text.slice(0, match.index);
        const found = match[0];
        const after = text.slice(match.index + found.length);
        const mark = document.createElement('mark');
        mark.textContent = found;

        cell.appendChild(document.createTextNode(before));
        cell.appendChild(mark);
        cell.appendChild(document.createTextNode(after));
    }
}

function renderTable() {
    recordsBody.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        if (recordMatchesSearch(record) === true) {
        const row = document.createElement('tr');
        const descriptionCell = document.createElement('td');
        const amountCell = document.createElement('td');
        const categoryCell = document.createElement('td');
        const dateCell = document.createElement('td');
        
        fillCell(descriptionCell, record.description);
        fillCell(amountCell, record.amount);
        fillCell(categoryCell, record.category);
        fillCell(dateCell, record.date);

        row.appendChild(descriptionCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        recordsBody.appendChild(row);
        }
    }
}

async function loadSeedData() {
    try {
        const response = await fetch('seed.json');
        const seedRecords = await response.json();
        records = seedRecords;
        renderTable();
    } catch (error) {
        console.log('Could not load seed.json', error);
    }
}

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
        renderTable();
        clearForm();
    } else {
        console.log('Your form is invalid');
    }
}

loadSeedData();