const fs = require("fs")

const fg = require('fast-glob');
const TurndownService = require('turndown');

const tomd = require('./tomd');
const tree = require('./treestruct');

const turndownService = new TurndownService();

const entries = fg.sync(['journey/*.json'], { dot: true });
const result = [];
for (const filePath of entries) {
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileData);
  const markdown = turndownService.turndown(data.text);
  result.push({time: data.date_journal, metadata: data.address, text: markdown })
}

tomd(tree(result));
