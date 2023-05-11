let data = [
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

let target = "Infected";

column = getColumn(data, data[0].indexOf(target));
unique_value = getUniqueValue(column);
all_entropy = entropy(unique_value, data);

for (let attr of data[0])
{
  if (attr === target)
  {
    continue;
  }

  let a = attr;
  console.log(attr)
  let dict = {};

  for (let i in unique_value)
  {
      dict[i] = [];
      dict[i].push(data[0]);
      for (let j = 1; j < data.length; j++)
      {
          let row = data[j];
          if (i === row[data[0].indexOf(a)])
              dict[i].push(row);
      }
  }

  let IG = all_entropy;

  for (let i in dict)
  {
      let s = data.length - 1;
      let s_i = dict[i].length - 1;

      column = getColumn(dict[i], data[0].indexOf(target));
      unique_value = getUniqueValue(column);
      entr = entropy(unique_value, dict[i])

      IG += -(s_i/s) * entr;
      //console.log(-(s_i/s) * entr)
  }
  console.log(IG);
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