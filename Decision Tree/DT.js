class Node
{
  constructor(name, attr, data)
  {
    this.name = name;
    this.branches = [];
    this.attr = attr,
    this.data = data;
  }
}

// let dataset = [
//   ["Fever", "Cough", "Breathing issues", "Infected"],
//   ["No", "No", "No", "No"],
//   ["Yes", "Yes", "Yes", "Yes"],
//   ["Yes", "Yes", "No", "No"],
//   ["Yes", "No", "Yes", "Yes"],
//   ["Yes", "Yes", "Yes", "Yes"],
//   ["No", "Yes",  "No", "No"],
//   ["Yes", "No", "Yes", "Yes"],
//   ["Yes", "No", "Yes", "Yes"],
//   ["No", "Yes", "Yes", "Yes"],
//   ["Yes", "Yes", "No", "Yes"],
//   ["No", "Yes",  "No", "No"],
//   ["No", "Yes", "Yes", "Yes"],
//   ["No", "Yes", "Yes", "No"],
//   ["Yes","Yes", "No", "No"],
// ];

let dataset = [
  ["Outlook",   "Temperature", "Humidity", "Wind",   "Play Tennis"],
  ["Sunny",     "Hot",         "High",     "Weak",   "No"],
  ["Sunny",     "Hot",         "High",     "Strong", "No"],
  ["Overcast",  "Hot",         "High",     "Weak",   "Yes"],
  ["Rain",      "Mild",        "High",     "Weak",   "Yes"],
  ["Rain",      "Cool",        "Normal",   "Weak",   "Yes"],
  ["Rain",      "Cool",        "Normal",   "Strong", "Yes"],
  ["Overcast",  "Cool",        "Normal",   "Strong", "No"],
  ["Sunny",     "Mild",        "High",     "Weak",   "Yes"],
  ["Sunny",     "Cool",        "Normal",   "Weak",   "No"],
  ["Rain",      "Mild",        "Normal",   "Weak",   "Yes"],
  ["Sunny",     "Mild",        "Normal",   "Strong", "Yes"],
  ["Overcast",  "Mild",        "High",     "Strong", "Yes"],
  ["Overcast",  "Hot",         "Normal",   "Weak",   "Yes"],
  ["Rain",      "Mild",        "High",     "Strong", "No"]
];

let target = dataset[0][dataset[0].length - 1];
let root = new Node("root", target, dataset);
let visited = [target];
let queue = [root];

// getTree(root);
// getTree(root.branches[0]);
// getTree(root.branches[0].branches[0]);
// getTree(root.branches[1]);
// getTree(root.branches[1].branches[1]);
// getTree(root.branches[2]);
// getTree(root.branches[2].branches[2]);
// console.log(visited);
// console.log(root);

init();

function init()
{
  while (queue.length !== 0)
  {
    node = queue[0];
    queue.shift();
    getTree(node);
  }
  console.log(root);
}

function getTree(node)
{
  let data = node.data;
  let best_ig = {dict: {},valueIG:0,attr: 0};

  let check = [];

  if (visited.length === data[0].length)
    return;

  column = getColumn(data, data[0].indexOf(target));
  unique_value = getUniqueValue(column);
  all_entropy = entropy(unique_value, data);

  for (let attr of data[0])
  {
    if (visited.includes(attr))
      continue;

    let dict = getUniqueRows(attr, data);

    let IG = all_entropy;

    for (let i in dict)
    {
        let s = data.length - 1;
        let s_i = dict[i].length - 1;

        column = getColumn(dict[i], data[0].indexOf(target));
        unique_value = getUniqueValue(column);
        entr = entropy(unique_value, dict[i])

        IG += -(s_i/s) * entr;
    }
    if (IG === 0)
      return;
    check.push({dict: dict, valueIG: IG, attr: attr});
  }
  for(let i of check)
  {
      if (i.valueIG > best_ig.valueIG)
      {
          best_ig = i;
      }
  }
  visited.push(best_ig.attr);

  for(let i in best_ig.dict)
  {
    new_node = new Node(best_ig.attr + " = " + i,best_ig.attr, best_ig.dict[i]);
    node.branches.push(new_node);
    queue.push(new_node);
  }
}

function getUniqueRows(attribute, data)
{
  column = getColumn(data, data[0].indexOf(attribute));
  unique_value = getUniqueValue(column);

  let dict = {};

  for (let i in unique_value)
  {
    dict[i] = [];
    dict[i].push(data[0]);
    for (let j = 1; j < data.length; j++)
    {
        let row = data[j];
        if (i === row[data[0].indexOf(attribute)])
            dict[i].push(row);
    }
  }
  return dict;
}


function entropy(unique_value, data)
{
  let entropy = 0;
  let p;
  for (let i in unique_value)
  {
      p = unique_value[i] / (data.length-1);
      entropy += -p * Math.log2(p);
  }
  return entropy;
}

function getUniqueValue(column)
{
  let unique_value = {};

  for (let i = 0; i < column.length; i++)
  {
      unique_value[column[i]] = 0;
  }

  for (let i = 0; i < column.length; i++)
  {
      unique_value[column[i]] += 1;
  }
  return unique_value;
}

function getColumn(data, attribute_index)
{
  let column = [];

  for (let j = 1; j < data.length; j++)
  {
      column.push(data[j][attribute_index]);
  }
  return column;
}


function parseCsv()
{
  let file = document.getElementById("input_file");
  let a = [];
  a = file.files[0];
  const reader = new FileReader();
  reader.readAsText(file.files[0]);
  reader.onload = function()
  {
      let text = reader.result;
      for(let i = 0; i < text.length; i++)
      {
          let row = "";
          while(text[i] != "\n")
          {
              row += text[i];
              i++;
          }
          row = row.slice(0, -1);
          data.push(row.split(/,(?!\s)/));
      }
      console.log(data);
  }
}