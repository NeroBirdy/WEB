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

let dataset = [];


let data1 = [
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

let data2 = [
["Toothed",     "Hair",     "Breathes",     "Legs",     "Species"],
["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
["Not Toothed", "Hair",     "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Not Hair", "Not Breathes", "Not Legs", "Reptile"],
["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
["Not Toothed", "Not Hair", "Breathes",     "Legs",     "Mammal"],
];

let data3 = [
["Fever", "Cough", "Breathing issues", "Infected"],
["No", "No", "No", "No"],
["Yes", "Yes", "Yes", "Yes"],
["Yes", "Yes", "No", "No"],
["Yes", "No", "Yes", "Yes"],
["Yes", "Yes", "Yes", "Yes"],
["No", "Yes",  "No", "No"],
["Yes", "No", "Yes", "Yes"],
["Yes", "No", "Yes", "Yes"],
["No", "Yes", "Yes", "Yes"],
["Yes", "Yes", "No", "Yes"],
["No", "Yes",  "No", "No"],
["No", "Yes", "Yes", "Yes"],
["No", "Yes", "Yes", "No"],
["Yes","Yes", "No", "No"],
];



var button = document.getElementById("myButton");
var list = document.getElementById("myList");

button.addEventListener("click", function() {
  if (list.style.display === "none") {
    list.style.display = "flex";
  } else {
    list.style.display = "none";
  }
});

var dynamicButtons = document.querySelectorAll("#myList button");

dynamicButtons.forEach(function(dynamicButton) {
  dynamicButton.addEventListener("click", function() {
    let text =  this.id;
    if (text === "data1")
    {
      dataset = data1;
    }
    else if (text === "data2")
    {
      dataset = data2;
    }
    else
    {
      dataset = data3;
    }
    list.style.display = "none";
    document.getElementById("input_file").value = "";
  });
});


let btn = document.getElementById("input_file");
btn.addEventListener("change", function()
{
  parseCsv();
});


const select = document.getElementById("selection");

const options = ["Запятая", "Точка с запятой", "Пробел"];

options.forEach((option) => {
  const optionElement = document.createElement("option");
  optionElement.text = option;
  optionElement.value = option;
  select.appendChild(optionElement);
});

select.addEventListener("change", function() {
  const selectedOption = select.options[select.selectedIndex].value;
  if (selectedOption === "Запятая")
  {
    devider = ",";
  }
  else if (selectedOption === "Точка с запятой")
  {
    devider = ";";
  }
  else
  {
    devider = " ";
  }
});

let container = document.getElementById("tree");
let devider = ",";
let target;
let root;
let visited;
let queue;

let checkForEnd = [];

async function init()
{
  let tree = document.getElementsByTagName("ul")[0].children[0].children;
  if (tree.length)
  {
    tree[1].remove();
    tree[0].remove();
  }
  if (!dataset.length)
  {
    return;
  }
  target = dataset[0][dataset[0].length - 1];
  root = new Node("root", target, dataset);
  visited = [target];
  queue = [root];
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
      let uniqueValue = getUniqueValue(column);
      
      let best = {value: 0, decision: 0};

      for(j in uniqueValue)
      {
        if (uniqueValue[j] > best.value)
        {
          best = {value: uniqueValue[j], decision: j};
        }
      }

      let name = target + " = " + best.decision;
      let newNode = new Node(name, target, []);
      i.branches.push(newNode);
    }
  }

  drawTree(root, container.children[0].children[0]);
}

let red = [];

async function byPass()
{
  if (document.getElementById("userInput").value === "")
  {
    return;
  }
  if (devider === ",")
  {
    decisionArray = document.getElementById("userInput").value.split(/,(?!\s)/);
  }
  if (devider === ";")
  {
    decisionArray = document.getElementById("userInput").value.split(/;(?!\s)/);
  }
  if (devider === " ")
  {
    decisionArray = document.getElementById("userInput").value.split(/ (?!\s)/);
  }
  let spans = document.getElementsByTagName("span");
  if (!spans.length)
  {
    return;
  }
  for (let i in spans)
  {
    spans[i].style = "background-color:white";
  }

  let li = document.getElementsByTagName("li")[0];
  await new Promise(resolve => setTimeout(resolve, 150));
  li.children[0].style = "background-color:red";
  for (let i of decisionArray)
  {
    let ul = li.children[1];
    let children = ul.children;
    // console.log(children);

    for (let j of children)
    {
      let name = j.children[0].innerHTML;
      let decision = name.split(" = ")[1];
      // console.log(j);

      if (decision === i)
      {
        li = j;
        await new Promise(resolve => setTimeout(resolve, 150));
        li.children[0].style = "background-color:red";
      }
    }
  }

  let result = li.children[1].children[0].children[0];
  if (result.innerHTML.includes(target))
  {
    await new Promise(resolve => setTimeout(resolve, 150));
    result.style = "background-color:red";
  }
}


function drawTree(node, container) {
  let span = document.createElement("span");
  span.innerHTML = node.name;
  span.className = "block";
  container.appendChild(span);
  if (node.name.includes(target))
    return;
  let ul = document.createElement("ul");

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
  let bestIG = {dict: {},valueIG: -1,attr: 0};

  let check = [];

  if (visited.length === data[0].length)
    return;

  column = getColumn(data, data[0].indexOf(target));
  uniqueValue = getUniqueValue(column);
  allEntropy = entropy(uniqueValue, data);

  for (let attr of data[0])
  {
    if (visited.includes(attr))
      continue;

    let dict = getUniqueRows(attr, data);

    let IG = allEntropy;

    for (let i in dict)
    {
        let s = data.length - 1;
        let Si = dict[i].length - 1;

        column = getColumn(dict[i], data[0].indexOf(target));
        uniqueValue = getUniqueValue(column);
        entr = entropy(uniqueValue, dict[i])

        IG += -(Si/s) * entr;
    }
    if (IG === 0)
    {
      continue;
    }
      
    check.push({dict: dict, valueIG: IG, attr: attr});
  }
  for(let i of check)
  {
      if (i.valueIG > bestIG.valueIG)
      {
          bestIG = i;
      }
  }
  visited.push(bestIG.attr);

  for(let i in bestIG.dict)
  {
    newNode = new Node(bestIG.attr + " = " + i,bestIG.attr, bestIG.dict[i]);
    node.branches.push(newNode);
    queue.push(newNode);
    checkForEnd.push(newNode);
  }
}

function getUniqueRows(attribute, data)
{
  column = getColumn(data, data[0].indexOf(attribute));
  uniqueValue = getUniqueValue(column);

  let dict = {};

  for (let i in uniqueValue)
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


function entropy(uniqueValue, data)
{
  let entropy = 0;
  let p;
  for (let i in uniqueValue)
  {
      p = uniqueValue[i] / (data.length-1);
      entropy += -p * Math.log2(p);
  }
  return entropy;
}

function getUniqueValue(column)
{
  let uniqueValue = {};

  for (let i = 0; i < column.length; i++)
  {
      uniqueValue[column[i]] = 0;
  }

  for (let i = 0; i < column.length; i++)
  {
      uniqueValue[column[i]] += 1;
  }
  return uniqueValue;
}

function getColumn(data, attributeIndex)
{
  let column = [];

  for (let j = 1; j < data.length; j++)
  {
      column.push(data[j][attributeIndex]);
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
          if (devider === ",")
          {
            dataset.push(row.split(/,(?!\s)/));
          }
          if (devider === ";")
          {
            dataset.push(row.split(/;(?!\s)/));
          }
          if (devider === " ")
          {
            dataset.push(row.split(/ (?!\s)/));
          }
      }

  }
}

