'use strict';

const fs = require('node:fs');
const path = require('node:path');

const faqScriptPath = path.resolve(__dirname, '..', 'script.js');
const parts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).formatToParts(new Date());
const datePart = (type) => parts.find((part) => part.type === type).value;
const today = `${datePart('year')}-${datePart('month')}-${datePart('day')}`;
const source = fs.readFileSync(faqScriptPath, 'utf8');
const updatedSource = source.replace(
  /const faqUpdatedAt = '\d{4}-\d{2}-\d{2}';/,
  `const faqUpdatedAt = '${today}';`
);

if (updatedSource === source && !source.includes(`const faqUpdatedAt = '${today}';`)) {
  throw new Error('Não foi possível localizar a data do FAQ.');
}

if (updatedSource !== source) {
  fs.writeFileSync(faqScriptPath, updatedSource, 'utf8');
}

console.log(`Data do FAQ: ${today}`);
