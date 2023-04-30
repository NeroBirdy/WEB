const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let slider = document.getElementById("Slider");
let value = document.getElementById("value");


let time;
let n;
let cube;
let matrix;
let start = [-1, -1];
let end = [-1, -1];


function createMap()
{
    n = document.getElementById("input").value;
    matrix = getMatrix(0);
    context.clearRect(0, 0, 800, 800);
    context.beginPath();
    cube = 800 / n;
    let x = 0;
    let y = 0;
    for (let i = 0; i <= n; i++)
    {
        context.moveTo(x, 0);
        context.lineTo(x, cube * n);
        x += cube;
    }

    for (let i = 0; i <= n; i++)
    {
        context.moveTo(0, y);
        context.lineTo(cube * n, y);
        y += cube;
    }

    context.stroke();
    canvas.addEventListener("click", Click);

    document.getElementById("start").onclick = function(){operation = 1;};
    document.getElementById("end").onclick = function(){operation = 2;};
    document.getElementById("walls").onclick = function(){operation = 0;};
}

function getMatrix(count) {
    let matrix = new Array(n);
    for (let i = 0; i < n; ++i)
    {
        matrix[i] = new Array(n);
        for (let j = 0; j < n; ++j)
        {
            matrix[i][j] = count;
        }
    }
    return matrix;
}

async function generatePrimMaze() {

    start = [-1, -1];
    end = [-1, -1];
    matrix =  getMatrix(1);
    for (let i = 0; i < n; i++)
    {
        for(let j = 0; j < n; j++)
        {
            context.fillStyle="#1c1c1c";
            context.fillRect(j * cube + 1, i * cube + 1, cube - 2, cube - 2);
        }
    }
    
    let ost = n % 2;
    let count = (n - ost) / 2;
    let cells = [];
    for (let y = 0; y < count; y++) {
      cells[y] = [];
      for (let x = 0; x < count; x++) {
        let cell = {
          x: x,
          y: y,
          index: [x, y],
          status: "unvisited",
          adjacents: [],
          connections: []
        };
        cells[y][x] = cell;
        if (x + 1 < 0) {
            let up = cells[y][x + 1];
            cell.adjacents.push(up);
            up.adjacents.push(cell);
        }
        if (y - 1 >= 0) {
            let right = cells[y - 1][x];
            cell.adjacents.push(right);
            right.adjacents.push(cell);
        }
        if (y + 1 < 0) {
            let left = cells[y + 1][x];
            cell.adjacents.push(left);
            left.adjacents.push(cell);
        }
        if (x - 1 >= 0) {
            let down = cells[y][x - 1];
            cell.adjacents.push(down);
            down.adjacents.push(cell);
        }
      }
    }
  let visited = new Set();
  let frontier = new Set();
  let startY = Math.floor(Math.random() * cells.length);
  let startX = Math.floor(Math.random() * cells[startY].length);
  let st = cells[startY][startX];
  frontier.add(st);
  let current = st;
  recursiveSpanningTree();
  async function recursiveSpanningTree() {
    frontier.delete(current);
    visited.add(current);
    current.status = "visited";
    matrix[current.x * 2 + 1][current.y * 2 + 1] = 0;
    context.fillStyle="#ffffff";
    context.fillRect((current.y * 2 + 1) * cube + 1, (current.x * 2 + 1) * cube + 1, cube - 2, cube - 2);

    function addToFrontier(adjCells) {
        for (let c of adjCells) {
          if (c.status === "unvisited") {
            frontier.add(c);
            c.status = "frontier";
            c.connections.push(current);
          } else if (c.status === "frontier") {
            c.connections.push(current);
          }
        }
      }
      addToFrontier(current.adjacents);
    let iteratable = [...frontier.values()];
    let randomIndex = Math.floor(Math.random() * iteratable.length);
    let frontierCell = iteratable[randomIndex];
    if (frontierCell) {
        let randomConn = Math.floor(
          Math.random() * frontierCell.connections.length
        );
        let connectX = frontierCell.x + frontierCell.connections[randomConn].x;
        let connectY = frontierCell.y + frontierCell.connections[randomConn].y;
        matrix[connectX + 1][connectY + 1] = 0;
        context.fillStyle = "#ffffff";
        context.fillRect((connectY + 1) * cube + 1, (connectX + 1) * cube + 1, cube - 2, cube - 2);

      }
     current = frontierCell;
     if (frontier.size > 0) {
        await wait(0);
        recursiveSpanningTree();
     }
   }
}



function Click(event)
{
    let RightX = event.pageX - event.target.offsetLeft;
    let RightY = event.pageY - event.target.offsetTop;

    let i = Math.floor(RightX / cube);
    let j = Math.floor(RightY / cube);

    let cellX = i * cube;
    let cellY = j * cube;
    switch(operation)
    {
        case 0:
            if (start[0] === j && start[1] == i)
            {
                start = [-1, -1];
            }
            if (end[0] === j && end[1] == i)
            {
                end = [-1, -1];
            }
            if (matrix[j][i])
            {
                matrix[j][i] = 0;
                context.fillStyle = "#ffffff";
                context.fillRect(cellX + 1 , cellY + 1, cube - 2, cube - 2);
            }
            else
            {
                matrix[j][i] = 1;
                context.fillStyle = "#1c1c1c";
                context.fillRect(cellX + 1, cellY + 1, cube - 2, cube - 2);
            }
            break;

        case 1:
            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(CellX * cube + 1, CellY * cube + 1, cube - 2, cube - 2);
            }
            if (JSON.stringify(start) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(start[1] * cube + 1, start[0] * cube + 1, cube - 2, cube - 2);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(end)){
                context.fillStyle="#ffffff";
                context.fillRect(end[1] * cube + 1, end[0] * cube + 1, cube - 2, cube - 2);
                end = [-1, -1];
            }

            context.fillStyle="#81d8d0";
            context.fillRect(cellX + 1 , cellY + 1 , cube - 2, cube - 2);
            start[0] = j;
            start[1] = i;
            break;

        case 2:
            if (matrix[j][i])
            {
                matrix[j][i] = 0;
                context.fillStyle = "#ffffff";
                context.fillRect(cellX + 1 , cellY + 1, cube - 1, cube - 1);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(start)){
                context.fillStyle="#ffffff";
                context.fillRect(start[1] * cube + 1, start[0] * cube * cube + 1, cube - 2, cube - 2);
                start = [-1, -1];
            }
            if (JSON.stringify(end) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(end[1] * cube + 1, end[0] * cube + 1, cube - 2, cube - 2);
            }

            context.fillStyle="#d21f3c";
            context.fillRect(cellX + 1, cellY + 1, cube - 2, cube - 2);
            end[0] = j;
            end[1] = i;
            break;
    }

}

function Queue()
{
    let Set = [];

    this.add_to = function(cell)//Добавляем ячейку и расстояние 
    {
        if (this.Is_Empty())
            {
                Set.push(cell);
            }
        else
        {
            let fl = false;
            for (let i = 0; i < Set.length; i++)
            {
                if (cell[1] < Set[i][1])
                {
                    Set.splice(i, 0, cell);
                    fl = true;
                    break;
                }
            }
            if (!fl)
            {
                Set.push(cell);
            }
        }
    }
    
    this.take_first = function()
    {
        return Set.shift();
    }

    this.Is_Empty = function()
    {
        return Set.length === 0;
    }
}

function heuristic(cur, end)
{
    return  2 * Math.max(Math.abs(end[0] - cur[0]),Math.abs(end[1] - cur[1]));
}

function getNeigbors(cur, G)
{
    let neighbours = [];
    let x = cur[0][0];
    let y = cur[0][1];
    if(y != n - 1 && !matrix[x][y + 1] && G[x][y + 1] === -1)
    {
        neighbours.push([x, y + 1]);
    }
    if(x != n - 1 && !matrix[x + 1][y] && G[x + 1][y] === -1)
    {
        neighbours.push([x + 1, y]);
    }
    if(x != 0 && !matrix[x - 1][y] && G[x - 1][y] === -1)
    {
        neighbours.push([x - 1, y]);
    }
    if(y != 0 && !matrix[x][y - 1] && G[x][y - 1] === -1)
    {
        neighbours.push([x, y - 1]);
    }
    // if(x > 0 && y > 0 && !matrix[x - 1][y - 1] && G[x - 1][y - 1] === -1)
    // {
    //     neighbours.push([x - 1, y - 1]);
    // }
    // if(x < n - 1 && y < n - 1 && !matrix[x + 1][y + 1] && G[x + 1][y + 1] === -1)
    // {
    //     neighbours.push([x + 1, y + 1]);
    // }
    // if(x > 0 && y < n - 1 && !matrix[x - 1][y + 1] && G[x - 1][y + 1] === -1)
    // {
    //     neighbours.push([x - 1, y + 1]);
    // }
    // if(x < n - 1 && y > 0 && !matrix[x + 1][y - 1] && G[x + 1][y - 1] === -1)
    // {
    //     neighbours.push([x + 1, y - 1]);
    // }
    return neighbours;
}

async function wait(c) {
    time = 200 - document.getElementById("Slider").value;
    if (c)
    {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    return new Promise(resolve => setTimeout(resolve, 5));
}

async function Astar(start, end)
{
    let queue = new Queue();
    let GScores = getMatrix(-1);

    GScores[start[0]][start[1]] = 0;
    let parents = new Array(n);//Инициализируем Массив Родителей, позже понадобится для окраски пути
    for (let i = 0; i < n; i++)
    {
        parents[i] = new Array(n)
        for (let j = 0; j < n; j++)
        {
            parents[i][j] = new Array(2);
            parents[i][j][0] = -1;
            parents[i][j][1] = -1;
        }
    }
    queue.add_to([start, heuristic(start, end)]);
    while(!queue.Is_Empty())
    {
        let current = queue.take_first();
        if (current[0][0] === end[0] && current[0][1] === end[1])
        {
            break;
        }

        let neighbours = getNeigbors(current, GScores);
        for (let i = 0; i < neighbours.length; i++)
        {
            let neigbor = neighbours[i];

            context.fillStyle = "#f5e1ab";
            context.fillRect(neigbor[1] * cube + 1, neigbor[0] * cube + 1, cube - 2, cube - 2);
            await wait(1);

            context.fillStyle = "#e3d3f0";
            context.fillRect(neigbor[1] * cube + 1, neigbor[0] * cube + 1, cube - 2, cube - 2);

            let nX = neigbor[0];
            let nY = neigbor[1];
            let cX = current[0][0];
            let cY = current[0][1];

            if (GScores[nX, nY] === -1 || GScores[cX][cY] + 1 > GScores[nX][nY])
            {
                parents[nX][nY][0] = cX;
                parents[nX][nY][1] = cY;
                GScores[nX][nY] = GScores[cX][cY] + 1;
                queue.add_to([neigbor, GScores[nX][nY] + heuristic(neigbor, end)]);
            }
        }
    }
    context.fillStyle = "#d21f3c";
    context.fillRect(end[1] * cube + 1, end[0] * cube + 1, cube - 2, cube - 2);
    if (JSON.stringify(parents[end[0]][end[1]]) !== JSON.stringify([-1, -1]))
    {
        let cell = parents[end[0]][end[1]];
        while (cell[0] !== -1 && cell[1] !== -1)
        {
            context.fillStyle = "#822cd8";
            context.fillRect(cell[1] * cube + 1, cell[0] * cube + 1, cube - 2, cube - 2);
            cell = parents[cell[0]][cell[1]];
        }
        context.fillStyle = "#81d8d0";
        context.fillRect(start[1] * cube + 1, start[0] * cube + 1, cube - 2, cube - 2);
    }
    else
    {
        alert("Пути нет");
    }
}


