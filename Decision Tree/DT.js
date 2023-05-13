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

// let dataset = [
//   ["Toothed",     "Hair",     "Breathes",     "Legs",     "Species"],
//   ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
//   ["Not Toothed", "Hair",     "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Not Hair", "Not Breathes", "Not Legs", "Reptile"],
//   ["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
//   ["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
//   ["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
//   ["Not Toothed", "Not Hair", "Breathes",     "Legs",     "Mammal"],
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

let container = document.getElementById("tree");
let target = dataset[0][dataset[0].length - 1];
let root = new Node("root", target, dataset);
let visited = [target];
let queue = [root];

let checkForEnd = [];

init();

function init()
{
  while (queue.length !== 0)
  {
    node = queue[0];
    queue.shift();
    getTree(node);
  }

  for(let i of checkForEnd)
  {
    if (!i.branches.length)
    {
      let column = getColumn(i.data, i.data[0].indexOf(target));
      let unique_value = getUniqueValue(column);
      
      let best = {value: 0, decision: 0};

      for(j in unique_value)
      {
        if (unique_value[j] > best.value)
        {
          best = {value: unique_value[j], decision: j};
        }
      }

      let name = target + " = " + best.decision;
      let new_node = new Node(name, target, []);
      i.branches.push(new_node);
    }
  }

  drawTree(root, container);
  // console.log(root);
}



function drawTree(node, container) {
  let ul = document.createElement("ul");
  let span = document.createElement("span");
  span.innerHTML = node.name;

  ul.appendChild(span);
  container.appendChild(ul);

  for (let i of node.branches)
  {
    let li = document.createElement("li");
    ul.appendChild(li);
    drawTree(i, li);
  }
}


function getTree(node)
{
  let data = node.data;
  let best_ig = {dict: {},valueIG: -1,attr: 0};

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
    {
      continue;
    }
      
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
    checkForEnd.push(new_node);
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
  dataset = [];
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
          dataset.push(row.split(/,(?!\s)/));
      }
      //console.log(data);
  }
}