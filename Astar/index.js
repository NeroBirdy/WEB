function ClTable()
{
    let n = document.getElementById("input").value;
    let ClearTable = document.querySelector("table");

    for (let i = 0; i < n; i++)
    {
        for (let j = 0; j < n; j++)
        {
            ClearTable.rows[i].cells[j].style.backgroundColor = "white";
        }
    }

    fl1 = false;
    fl2 = false;
    document.querySelector(".start").classList.remove("start");
    document.querySelector(".end").classList.remove("end");
}

function Clear_path()
{
    let n = document.getElementById("input").value;
    let Table = document.querySelector("table");
    for (let i = 0; i < n; i++)
    {
        for (let j = 0; j < n; j++)
        {
            if (Table.rows[i].cells[j].style.backgroundColor == "green")
                Table.rows[i].cells[j].style.backgroundColor = "white";
        }
    }
}


function createTable() {
    fl1 = false;
    fl2 = false;
    let n = document.getElementById("input").value;
    let container = document.getElementById("table-container");
    let table = document.createElement("table");

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

            if (operation == 1)
            {
                if ((color !== "blue") && !fl1)
                {
                    this.style.backgroundColor = "blue";
                    this.classList.add("start");
                    fl1 = true;
                }
                else if ((color !== "blue") && fl1)
                {
                    let el = document.querySelector(".start");
                    el.style.backgroundColor = "white";
                    el.classList.remove("start");
                    this.style.backgroundColor = "blue";
                    this.classList.add("start");
                }
                else
                {
                    this.classList.remove("start");
                    this.style.backgroundColor = "white";
                    fl1 = false;
                }
            }

            if (operation == 2)
            {
                if ((color !== "red") && !fl2)
                {
                    this.style.backgroundColor = "red";
                    this.classList.add("end");
                    fl2 = true;
                }
                else if ((color !== "red") && fl2)
                {
                    let el = document.querySelector(".end");
                    el.style.backgroundColor = "white";
                    el.classList.remove("end");
                    this.style.backgroundColor = "red";
                    this.classList.add("end");
                }
                else
                {
                    this.classList.remove("end");
                    this.style.backgroundColor = "white";
                    fl2 = false;
                }
            }

        };
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    container.innerHTML = "";
    container.appendChild(table);
  }

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
  function changeCell(c) {
    let n = document.getElementById("input").value;
    let container = document.getElementById("table-container");
    let table = container.querySelector("table");
    let cell = table.rows[Math.floor(c/n)].cells[c%n];
    cell.style.backgroundColor = "green";
    // container.innerHTML = "";
    // container.appendChild(table);
  }



  let current_start;
  let current_finish;
  let operation = 0;
  let fl1 = false;
  let fl2 = false;
  let start;
  let finish;
  let mtrx = [];
  let mtrxS = [];

  let s_x;
  let s_y;
  let f_x;
  let f_y;

  function matrix()
  {
    let n = document.getElementById("input").value;
    let container = document.getElementById("table-container");
    let table = container.querySelector("table");
    let count = 0;
    for (let i = 0; i < n; i++)
    {
        let a = [];
        for(let j = 0; j < n; j++)
        {
            if (table.rows[i].cells[j].style.backgroundColor === "blue")
                start = count;
            if (table.rows[i].cells[j].style.backgroundColor === "red")
                finish = count;
            if (table.rows[i].cells[j].style.backgroundColor !== "black")
            {
                a[j] = 0;
            }
            else
            {
                a[j] = 1;
            }
            count++;
        }
        mtrx[i] = a;
    }
    to_MatrixS();
  }

  function to_MatrixS()
    {
        let mtrxS = [];
        for (let i = 0; i < mtrx.length*mtrx.length; i++)
            mtrxS[i]=[];
        for (let i = 0; i < mtrx.length*mtrx.length; i++)
        {
            for (let j = 0; j < mtrx.length*mtrx.length; j++)
                mtrxS[i][j] = 0;
        }


        for (let i = 0; i < mtrx.length; i++)
        {
            for (let j = 0; j < mtrx.length; j++)
            {
                if (mtrx[i][j] != 1)
                {
                let k = i * mtrx.length + j;
                    if (j != 0 && mtrx[i][j - 1] != 1)
                    {
                        mtrxS[k][i * mtrx.length + j - 1] = 1;
                    }
                    if (j != mtrx.length-1 && mtrx[i][j + 1] != 1)
                    {
                        mtrxS[k][i * mtrx.length + j + 1] = 1;
                    }  
                    if (i != 0 && mtrx[i - 1][j] != 1)
                    {
                        mtrxS[k][(i - 1) * mtrx.length + j] = 1;
                    }
                    if (i != mtrx.length-1 && mtrx[i + 1][j] != 1)
                    {
                        mtrxS[k][(i + 1) * mtrx.length + j] = 1;
                    }
                    if (i != 0 && j != 0 && mtrx[i - 1][j - 1] != 1) // движение вверх-влево
                    {
                        mtrxS[k][(i - 1) * mtrx.length + j - 1] = 1;
                    }
                    if (i != 0 && j != mtrx.length-1 && mtrx[i - 1][j + 1] != 1) // движение вверх-вправо
                    {
                        mtrxS[k][(i - 1) * mtrx.length + j + 1] = 1;
                    }
                    if (i != mtrx.length-1 && j != 0 && mtrx[i + 1][j - 1] != 1) // движение вниз-влево
                    {
                        mtrxS[k][(i + 1) * mtrx.length + j - 1] = 1;
                    }
                    if (i != mtrx.length-1 && j != mtrx.length-1 && mtrx[i + 1][j + 1] != 1) // движение вниз-вправо
                    {
                        mtrxS[k][(i + 1) * mtrx.length + j + 1] = 1;
                    }
                }
            }
        }
        dijkstraWithPath(mtrxS,start,finish);
    }

    function dijkstraWithPath(adjacencyMatrix, startNode, endNode) 
    {
        let path = [];
        const numNodes = adjacencyMatrix.length;
        const distances = Array(numNodes).fill(Infinity);
        const visited = Array(numNodes).fill(false);
        const prev = Array(numNodes).fill(-1);
        distances[startNode] = 0;
      
        for (let i = 0; i < numNodes - 1; i++) {
          // Находим вершину с наименьшим расстоянием
          let minDistNode = -1;
          for (let j = 0; j < numNodes; j++) {
            if (!visited[j] && (minDistNode === -1 || distances[j] < distances[minDistNode])) {
              minDistNode = j;
            }
          }
      
          // Мы посетили эту вершину
          visited[minDistNode] = true;
      
          // Обновляем расстояния до всех соседних вершин
          for (let j = 0; j < numNodes; j++) {
            if (adjacencyMatrix[minDistNode][j] !== 0) {
              const dist = distances[minDistNode] + adjacencyMatrix[minDistNode][j];
              if (dist < distances[j]) {
                distances[j] = dist;
                prev[j] = minDistNode;
              }
            }
          }
        }
      
        // Восстанавливаем путь до конечной вершины
        let currentNode = endNode;
        while (currentNode !== -1) {
          path.unshift(currentNode);
          currentNode = prev[currentNode];
        }
      console.log(path.length);
      if (path.length == 1)
      alert("Маршрута нету");
      else
      {
        for (let i = 1; i < path.length - 1; i++)
            {
                changeCell(path[i]);
            }
      }
    }

