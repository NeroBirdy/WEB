function createTable() {
    let n = document.getElementById("input").value;
    let container = document.getElementById("table-container");
    let table = document.createElement("table");
  
    // создаем строки и ячейки таблицы
    for (let i = 0; i < n; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < n; j++) {
        let cell = document.createElement("td");
        cell.style.backgroundColor = "white";
        cell.onclick = function() {
            let color = this.style.backgroundColor;
            if (operation == 0 && (color === "white" | color === "black"))
            {
                if (!color | color === "white")
                {
                    this.style.backgroundColor = "black";
                }
                else
                {
                    this.style.backgroundColor = "white";
                }
            }



            if (operation == 1 && (color === "white" | color === "blue"))
            {
                if (!fl1)
                {
                    if (!color | color === "white")
                    {
                        this.style.backgroundColor = "blue";
                    }
                    else
                    {
                        this.style.backgroundColor = "white";
                    }
                    fl1 = true;
                }
                else
                {
                    if (color === "blue")
                    {
                        this.style.backgroundColor = "white";
                        fl1 = false;
                    }
                }
            }



            if (operation == 2 && (color === "white" | color === "red"))
            {
                if (!fl2)
                {
                    if (!color | color === "white")
                    {
                        this.style.backgroundColor = "red";
                    }
                    else
                    {
                        this.style.backgroundColor = "white";
                    }
                    fl2 = true;
                }
                else
                {
                    if (color === "red")
                    {
                        this.style.backgroundColor = "white";
                        fl2 = false;
                    }
                }
            }

        };
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  
    // очищаем контейнер и добавляем в него новую таблицу
    container.innerHTML = "";
    container.appendChild(table);
  }


  let operation = 0;
  let fl1 = false;
  let fl2 = false;


  function Op1()
  {
    operation = 0;
  }
  function Op2()
  {
    operation = 1;
  }
  function Op3()
  {
    operation = 2;
  }
  function changeCell(row, col) {
    let container = document.getElementById("table-container");
    let table = container.querySelector("table");
    let cell = table.rows[row].cells[col];
    cell.style.backgroundColor = "green";
    container.innerHTML = "";
    container.appendChild(table);
  }
  function matrix()
  {
    let n = document.getElementById("input").value;
    let mtrx = [];
    let container = document.getElementById("table-container");
    let table = container.querySelector("table");
    for (let i = 0; i < n; i++)
    {
        let a = [];
        for(let j = 0; j < n; j++)
        {
            if (table.rows[i].cells[j].style.backgroundColor !== "black")
            {
                a[j] = 0;
            }
            else
            {
                a[j] = 1;
            }
        }
        mtrx[i] = a;
    }
    console.log(mtrx);4
  }