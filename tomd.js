const fs = require("fs")
const path = require("path")

module.exports = function tomd(data) {
  for (const year in data) {
    if(data.hasOwnProperty(year)) {
      fs.mkdirSync(year);
      for (const month in data[year]) {
        if(data[year].hasOwnProperty(month)) {
          const reducer = (accumulator, currentValue) => {
            return `## ${new Date(currentValue.time).getDate()}\n${currentValue.text}\n\n${accumulator}`;
          }
          const monthText = data[year][month].reduce(reducer, '');
          fs.writeFileSync(path.join(year, `${month}.md`), monthText);
        }
      }
    }
  }
}

// const fileData = fs.readFileSync('output.json', 'utf-8');
// const data = JSON.parse(fileData);
// tomd(data);

