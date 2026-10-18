import {rules} from './validators.js';

const STORAGE_KEY = 'finance-tracker:records';
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
const submitButton = document.getElementById('submit-button');
const statCount = document.getElementById('stat-count');
const statTotal = document.getElementById('stat-total');
const statTop = document.getElementById('stat-top');
const statWeek = document.getElementById('stat-week');
const capInput = document.getElementById('cap-input');
const capError = document.getElementById('cap-error');
const capPolite = document.getElementById('cap-polite');
const capAssertive = document.getElementById('cap-assertive');
const CAP_KEY = 'finance-tracker:cap';
const settingsForm = document.getElementById('settings-form');
const baseCodeInput = document.getElementById('base-code');
const baseCodeError = document.getElementById('base-code-error');
const codeIInput = document.getElementById('codeI');
const codeIError = document.getElementById('codeI-error');
const rateIInput = document.getElementById('rateI')
const rateIError = document.getElementById('rateI-error')
const codeIIInput = document.getElementById('codeII')
const codeIIError = document.getElementById('codeII-error');
const rateIIInput = document.getElementById('rateII');
const rateIIError = document.getElementById('rateII-error');
const settingsStatus = document.getElementById('settings-status');
const currencyNote = document.getElementById('currency-note');
const SETTINGS_KEY = 'finance-tracker: settings';
const exportButton = document.getElementById('export-button');
const importInput = document.getElementById('import-input');
const dataStatus = document.getElementById('data-status');

let records = [];
let sortField = '';
let sortDirection = 'asc';
let searchRegex = null;
let editingId = null;
let spendingCap = null;
let settings = {
    baseCode: 'RWF',
    codeI: 'KES',
    rateI: 0.088,
    codeII: 'USD',
    rateII: 0.00068

};

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

function deleteRecord(id) {
    const remaining = [];
    for (let i = 0; i < records.length; i++) {
        if (records[i].id !== id) {
            remaining.push(records[i]);
        }
    }
    records =remaining;
    if (editingId === id) {
        clearForm();
    }
    saveRecords();
    renderTable();
    updateDashboard();
}

function handleDeleteClick(event) {
    const id = event.target.dataset.id;
    const sure = confirm('Would you like to delete this record?');
    if (sure === true) {
        deleteRecord(id);
    }
}

function findRecordById(id) {
    for (let i = 0; i < records.length; i++) {
        if (records[i].id === id) {
            return records[i];
        }
    }
    return null;
}

function updateRecord(id) {
    const record = findRecordById(id);
    if (record !== null) {
        record.description = descriptionInput.value;
        record.amount = Number (amountInput.value);
        record.category = categoryInput.value;
        record.date = dateInput.value;
        record.updatedAt = new Date().toISOString();
    }
}

function handleEditClick(event) {
    const id = event.target.dataset.id;
    const record = findRecordById(id);
    if (record !== null) {
        descriptionInput.value = record.description;
        amountInput.value = record.amount;
        categoryInput.value = record.category;
        dateInput.value = record.date;
        editingId = id;
        submitButton.textContent = 'Update transaction';
        descriptionInput.focus();
    }
}

//Dashboard: is this within the lat seven days?
function isInLast7Days(dateText) {
    const recordDate = new Date(dateText);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    let isRecent = false;
    
    if (recordDate >= sevenDaysAgo && recordDate <= today) {
        isRecent = true;
    }
    return isRecent;
}

// this is to add up everything I've spent
function calculateTotal() {
    let total = 0;
    for (let i = 0; i < records.length; i++) {
        total = total + records[i].amount;
    }
    return total;
} 
//to find the category spent on the most
function findTopCategory() {
    const categoryTotals = {};
    for (let i = 0; i< records.length; i++) {
        const categoryName = records[i].category.toLowerCase();
        //starts at zero 1e
        if (categoryTotals[categoryName] === undefined) {
            categoryTotals[categoryName] = 0;
        }
            categoryTotals[categoryName] = categoryTotals[categoryName] + records[i].amount;
    }
    let topName = 'None';
    let topAmount = 0;
    //allocate the biggest total
    for (const categoryName in categoryTotals) {
        if (categoryTotals[categoryName] > topAmount) {
            topAmount = categoryTotals[categoryName];
            topName = categoryName;
        }
    }
    return topName;
}

function calculateWeeklyTotal() {
    let weeklyTotal = 0;
    for (let i = 0; i < records.length; i++) {
        const recent = isInLast7Days(records[i].date);
        if (recent === true) {
            weeklyTotal = weeklyTotal + records[i].amount;
        }
    }
    return weeklyTotal;
}

function updateCapMessage(total) {
    let politeText = '';
    let assertiveText = '';

    if (spendingCap !== null && total > spendingCap) {
            const over = total - spendingCap;
            assertiveText = 'Over your cap by ' + over.toFixed(2) + '.';
        } else if (spendingCap !== null) {
            const left = spendingCap - total;
            politeText = 'You have ' + left.toFixed(2) + ' left under your cap.';
        }
    //shouldn't repeat
    if (capPolite.textContent !== politeText) {
        capPolite.textContent = politeText;
    }
    if (capAssertive.textContent !== assertiveText) {
        capAssertive.textContent = assertiveText;
    }
}

function updateDashboard() {
    const total = calculateTotal();
    const topCategory = findTopCategory();
    const weeklyTotal = calculateWeeklyTotal();

    statCount.textContent = records.length;
    statTotal.textContent = total.toFixed(2);
    statTop.textContent = topCategory;
    statWeek.textContent = weeklyTotal.toFixed(2);

    updateCapMessage(total);
    updateCurrencyNote(total);
}

function saveCap() {
    try {
        if (spendingCap === null) {
            localStorage.removeItem(CAP_KEY);
        } else {
            localStorage.setItem(CAP_KEY, String(spendingCap));
        }
    } catch (error) {
        console.log('Could not save cap', error);
    }
}

function loadCap() {
    try {
        const text = localStorage.getItem(CAP_KEY);
        if (text !== null) {
            spendingCap = Number(text)
            capInput.value = text;
        }
    } catch (error) {
        console.log('Could not read cap', error);
    }
}

function handleCapInput() {
    const text = capInput.value;
    const matchRule = rules.amount.pattern.test(text);
    let shouldUpdate = true;
    if (text === '') {
        spendingCap = null;
        capError.textContent = '';
    }
    else if (matchRule === false) {
        capError.textContent = rules.amount.message;
        shouldUpdate = false;
    }
    else {
        spendingCap = Number(text);
        capError.textContent = '';
    }
    if (shouldUpdate === true) {
        saveCap();
        updateDashboard();
    }
}
capInput.addEventListener('input', handleCapInput);

function updateCurrencyNote(total) {
    const convertedI = total * settings.rateI;
    const convertedII = total * settings.rateII;
    currencyNote.textContent = 'Your amount is in ' + settings.baseCode + '. Your total is ' + convertedI.toFixed(2) + ' ' + settings.codeI + ' or  ' + convertedII.toFixed(2) + ' ' + settings.codeII + '.';
}

function saveSettings() {
    try {
        const text = JSON.stringify(settings);
        localStorage.setItem(SETTINGS_KEY, text);
    } catch (error) {
        console.log('Could not save settings', error);
    }
}

function fillSettingsForm() {
    baseCodeInput.value = settings.baseCode;
    codeIInput.value = settings.codeI;
    rateIInput.value = settings.rateI;
    codeIIInput.value = settings.codeII;
    rateIIInput.value = settings.rateII;

}

function loadSettings() {
    try {
        const text = localStorage.getItem(SETTINGS_KEY);
        if (text !== null) {
            settings = JSON.parse(text);
        }
    } catch (error) {
        console.log('Could not read settings', error);
    }
    fillSettingsForm();
}

function validateBaseCode() {
    const text = baseCodeInput.value;
    const matchRule = rules.currency.pattern.test(text);
    let isValid = true;
    if (matchRule === false) {
        baseCodeError.textContent = rules.currency.message;
        isValid = false;
    } else {
        baseCodeError.textContent = '';
    }
    return isValid;
}

function validateCodeI() {
    const text = codeIInput.value;
    const matchRule = rules.currency.pattern.test(text);
    let isValid = true;
    if (matchRule === false) {
        codeIError.textContent = rules.currency.message;
        isValid = false;
    } else {
        codeIError.textContent = '';
    }
    return isValid;
}

function validateRateI() {
    const text = rateIInput.value;
    const matchRule = rules.rate.pattern.test(text);
    let isValid = true;
    if (matchRule === false) {
        rateIError.textContent = rules.rate.message;
        isValid = false;
    } else if (Number(text) === 0) {
        rateIError.textContent = "A rate cannot be zero.";
        isValid = false;
    } else {
        rateIError.textContent = '';
    }
    return isValid;
}

function validateCodeII() {
    const text = codeIIInput.value;
    const matchRule = rules.currency.pattern.test(text);
    let isValid = true;
    if (matchRule === false) {
        codeIIError.textContent = rules.currency.message;
        isValid = false;
    } else {
        codeIIError.textContent = '';
    }
    return isValid;
}

function validateRateII() {
    const text = rateIIInput.value;
    const matchRule = rules.rate.pattern.test(text);
    let isValid = true;
    if (matchRule === false) {
        rateIIError.textContent = rules.rate.message;
        isValid = false;
    } else if (Number(text) === 0) {
        rateIIError.textContent = "A rate cannot be zero" 
    }else {
        rateIIError.textContent = '';
    }
    return isValid;
}

function  handleSettingsSubmit(event) {
    event.preventDefault();
    const basePerf = validateBaseCode();
    const codeIPerf = validateCodeI();
    const rateIPerf = validateRateI();
    const codeIIPerf = validateCodeII();
    const rateIIPerf = validateRateII();
    if (basePerf === true && codeIPerf === true && rateIPerf === true && codeIIPerf === true && rateIIPerf === true) {
        settings.baseCode = baseCodeInput.value;
        settings.codeIPerf = codeIInput.value;
        settings.rateI = Number(rateIInput.value);
        settings.codeII = codeIIInput.value;
        settings.rateII = Number(rateIIInput.value);
        saveSettings();
        updateDashboard();
        settingsStatus.textContent = 'Settings are saved.';
    } else {
        settingsStatus.textContent = 'Please fix the errors above.';
    }
}
settingsForm.addEventListener('submit', handleSettingsSubmit);

function exportRecords() {
    const text = JSON.stringify(records, null, 2);
    const file = new Blob([text], { type: 'application/json'});
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-records.json';
    link.click();
    URL.revokeObjectURL(url);
    dataStatus.textContent = 'Exported ' + records.length + ' records.';
}
exportButton.addEventListener('click', exportRecords);

function checkImportedRecord(record) {
    let problem = '';
    if (record.id === undefined) {
        problem = 'has no id';
    } else if (record.description === undefined || record.description === '') {
        problem = 'has no description';
    }else if (typeof record.amount !== 'number' || record.amount < 0) {
        problem = 'has an amount that is not a valid number';
    } else if (record.category === undefined || rules.category.pattern.test(record.category) === false) {
        problem = 'has an invalid category';
    } else if (record.date === undefined || rules.date.pattern.test(record.date) === false) {
        problem = 'has a date that is not in the format YYYY-MM-DD';
    }
    return problem;
}

async function handleImport(event) {
    const file = event.target.files[0];
    if (file !== undefined) {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);
            let problem = '';
            if (Array.isArray(imported) === false) {
                problem = 'The file must contain a list of records.';
            } else {
                for (let i = 0; i < imported.length; i++) {
                    const reason = checkImportedRecord(imported[i]);
                    //first problem 
                    if (reason !== '' && problem === '') {
                        problem = 'Record ' + (i + 1) + ' ' + reason + '.';
                        break;
                    }
                }
            }
                if (problem === '') {
                    records = imported;
                    saveRecords();
                    renderTable();
                    updateDashboard();
                    clearForm();
                    dataStatus.textContent = 'Imported ' + imported.length + ' records.';
                } else {
                    dataStatus.textContent = 'Nothing was changed.';
                } 
            } catch (error) {
                dataStatus.textContent = 'Import has failed because that file is not vaild JSON. Nothing was changed';
            }
            importInput.value = '';
        }
    }
importInput.addEventListener('change', handleImport);

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

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.id = record.id;
        deleteButton.setAttribute('aria-label', 'Delete ' + record.description);
        deleteButton.addEventListener('click', handleDeleteClick);
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.dataset.id = record.id;
        editButton.setAttribute('aria-label', 'Edit' + record.description);
        editButton.addEventListener('click', handleEditClick);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(descriptionCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);
        recordsBody.appendChild(row);
        }
    }
}

async function loadSeedData() {
    try {
        const response = await fetch('seed.json');
        const seedRecords = await response.json();
        records = seedRecords;
        saveRecords();
        renderTable();
        updateDashboard();
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
    editingId = null;
    submitButton.textContent = 'Save transaction';
}

function handleSubmit(event) {
    event.preventDefault();
    const amountPerf = validateAmount();
    const descriptionPerf = validateDescription();
    const categoryPerf = validateCategory();
    const datePerf = validateDate();

    if (amountPerf === true && descriptionPerf === true && categoryPerf === true && datePerf === true) {
        if (editingId === null) {
            const newRecord = createRecord();
            records.push(newRecord);
        } else {
            updateRecord(editingId);
        }
        saveRecords();
        renderTable();
        updateDashboard();
        clearForm();
    } else {
        console.log('Your form is invalid');
    }
}

function saveRecords() {
    try {
        const text = JSON.stringify(records);
        localStorage.setItem(STORAGE_KEY, text);
    } catch (error) {
        console.log('Could not save records', error);
    }
}

function loadSavedRecords() {
    try {
        const text = localStorage.getItem(STORAGE_KEY);
        if (text === null) {
            return null;
        }
        const savedList = JSON.parse(text);
        return savedList;
    } catch (error) {
        console.log('Could not read saved records', error);
        return null;
    }
}

async function startApp() {
    loadSettings();
    loadCap();
    const savedList = loadSavedRecords();
    if (savedList !== null) {
        records = savedList;
        renderTable();
        updateDashboard();
    } else {
        await loadSeedData();
    }
}
startApp();