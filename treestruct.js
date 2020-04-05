module.exports = function tree(data) {
  const result = {};
  for (const i of data) {
    const postYear = new Date(i.time).getFullYear();
    const postMonth = new Date(i.time).getMonth() + 1;
    if (result[postYear]) {
      if (result[postYear][postMonth]) {
        result[postYear][postMonth].push(i);
      } else {
        result[postYear][postMonth] = [i];
      }
    } else {
      result[postYear] = {};
      result[postYear][postMonth] = [i];
    }
  }
  return result;
}

// const fs = require("fs")
// const fileData = fs.readFileSync('data.json', 'utf-8');
// const data = JSON.parse(fileData);
// fs.writeFileSync('./output.json', JSON.stringify(tree(data), null, 2) , 'utf-8');
