import { rules } from './validators.js';

const resultsBody = document.getElementById('results');
const summary = document.getElementById('summary');
const tests = [
    {rule: 'description', value: " Lunch", expectMatch: false},
    {rule: 'description', value: "Lunch at cafe", expectMatch: true},
    {rule: 'description', value: "Mom's gift", expectMatch: true},
    {rule: 'description', value: "Lunch at  cafe", expectMatch: false},
    {rule: 'description', value: "Lunch", expectMatch: true},
    {rule: 'description', value: "Lunch", expectMatch: true},
    {rule: 'description', value: "Ab", expectMatch: false},
    {rule: 'description', value: " ", expectMatch: false},

    {rule: 'amount', value: "12.50", expectMatch: true},
    {rule: 'amount', value: "0.01", expectMatch: true},
    {rule: 'amount', value: "250000", expectMatch: true},
    {rule: 'amount', value: "0", expectMatch: false},
    {rule: 'amount', value: "007", expectMatch: false},
    {rule: 'amount', value: "12.505", expectMatch: false},
    {rule: 'amount', value: "abc", expectMatch: false},
    {rule: 'amount', value: "-5", expectMatch: false},
    {rule: 'amount', value: "12.50", expectMatch: true},

    {rule: 'category', value: "Food", expectMatch: true},
    {rule: 'category', value: "Eating-out", expectMatch: true},
    {rule: 'category', value: "Fun-Fit", expectMatch: true},
    {rule: 'category', value: "Food2", expectMatch: false},
    {rule: 'category', value: "-Food", expectMatch: false},
    {rule: 'category', value: "Food-", expectMatch: false},
    {rule: 'category', value: "Food out", expectMatch: true},

    {rule: 'date', value: "2024-10-24", expectMatch: true},
    {rule: 'date', value: "2026-02-29", expectMatch: true},
    {rule: 'date', value: "2026-13-01", expectMatch: false},
    {rule: 'date', value: "2024-10-32", expectMatch: false},
    {rule: 'date', value: "24/10/2024", expectMatch: false},
    {rule: 'date', value: "2027-1-24", expectMatch: false},
    {rule: 'date', value: "2024-22-90", expectMatch: false},
    {rule: 'date', value: "2025-10-24", expectMatch: true},

    {rule: 'duplicateWord', value: "coffee coffee", expectMatch: true},
    {rule: 'duplicateWord', value: "Coffee coffee with the girls", expectMatch: true},
    {rule: 'duplicateWord', value: "Lunch at cafe", expectMatch: false},
    {rule: 'duplicateWord', value: "Lunch at cafeteria", expectMatch: false},
    {rule: 'duplicateWord', value: "cookie factory", expectMatch: false},
    {rule: 'duplicateWord', value: "pasta ravioli", expectMatch: false},
    {rule: 'duplicateWord', value: "coffee coffee", expectMatch: true},
    {rule: 'duplicateWord', value: "coffee coffee", expectMatch: true},

    {rule: 'currency', value: "KES", expectMatch: true},
    {rule: 'currency', value: "RWF", expectMatch: true},
    {rule: 'currency', value: "usd", expectMatch: false},
    {rule: 'currency', value: "US", expectMatch: false},
    {rule: 'currency', value: "USDT", expectMatch: false},
    {rule: 'currency', value: "Kesh", expectMatch: false},

    {rule: 'rate', value: "0.92", expectMatch: true},
    {rule: 'rate', value: "-1", expectMatch: false},
    {rule: 'rate', value: "0123456", expectMatch: false},
    {rule: 'rate', value: "0.00000823457", expectMatch: false},
    {rule: 'rate', value: "165.09", expectMatch: true},
    {rule: 'rate', value: "234", expectMatch: true},
    {rule: 'rate', value: "0.92", expectMatch: true},
];

function runTest(test) {
    const pattern = rules[test.rule].pattern;
    const actualMatch = pattern.test(test.value);
    return actualMatch === test.expectMatch;
}

function makeCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}
let passed = 0;
for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const kawabanga = runTest(test);
    if (kawabanga === true) {
        passed = passed + 1;
    }
    let expectText = 'no match';
    if (test.expectMatch === true) {
        expectText = 'match';
    }
    let resultText = 'FAIL';
    if (kawabanga === true) {
        resultText = 'PASS';
    }
    const row = document.createElement('tr');
    const resultCell = makeCell(resultText);
    resultCell.className = kawabanga === true ? 'pass' : 'fail';

    row.appendChild(makeCell(test.rule));
    row.appendChild(makeCell('"' + test.value + '"'));
    row.appendChild(makeCell(expectText));
    row.appendChild(resultCell);
    resultsBody.appendChild(row);
}

summary.textContent = passed + ' of ' + tests.length + ' tests passed.';