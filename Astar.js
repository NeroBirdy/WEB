const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let n;
let cube;
let matrix;
let start = [-1, -1];
let end = [-1, -1];

function createMap()
{
    n = document.getElementById("input").value;
    matrix = getMatrix(n, 0);
    context.clearRect(0, 0, 500, 500);
    context.beginPath();
    cube = 500 / n;
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

function getMatrix(n, count) {
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
                context.fillRect(cellX + 0.5 , cellY + 0.5, cube - 1, cube - 1);
            }
            else
            {
                matrix[j][i] = 1;
                context.fillStyle = "#000000";
                context.fillRect(cellX, cellY, cube, cube);
            }
            break;

        case 1:
            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(CellX * cube + 0.5, CellY * cube + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify(start) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(start[1] * cube + 0.5, start[0] * cube + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(end)){
                context.fillStyle="#ffffff";
                context.fillRect(end[1] * cube + 0.5, end[0] * cube + 0.5, cube - 1, cube - 1);
                end = [-1, -1];
            }

            context.fillStyle="blue";
            context.fillRect(cellX + 0.5, cellY + 0.5, cube - 1, cube - 1);
            start[0] = j;
            start[1] = i;
            break;

        case 2:
            if (matrix[j][i])
            {
                matrix[j][i] = 0;
                context.fillStyle = "#ffffff";
                context.fillRect(cellX + 0.5 , cellY + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(start)){
                context.fillStyle="#ffffff";
                context.fillRect(start[1] * cube + 0.5, start[0] * cube * cube + 0.5, cube - 1, cube - 1);
                start = [-1, -1];
            }
            if (JSON.stringify(end) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(end[1] * cube + 0.5, end[0] * cube + 0.5, cube - 1, cube - 1);
            }

            context.fillStyle="red";
            context.fillRect(cellX + 0.5, cellY + 0.5, cube - 1, cube - 1);
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
    return  2 * (Math.abs(cur[0] - end[0]) + Math.abs(cur[1] - end[1]));
}

function getNeigbors(cur, matrix, G)
{
    let neighbours = [];
    let x = cur[0][0];
    let y = cur[0][1];
    if(x != n - 1 && !matrix[x + 1][y] && G[x + 1][y] === -1)
    {
        neighbours.push([x + 1, y]);
    }
    if(y != n - 1 && !matrix[x][y + 1] && G[x][y + 1] === -1)
    {
        neighbours.push([x, y + 1]);
    }
    if(x != 0 && !matrix[x - 1][y] && G[x - 1][y] === -1)
    {
        neighbours.push([x - 1, y]);
    }
    if(y != 0 && !matrix[x][y - 1] && G[x][y - 1] === -1)
    {
        neighbours.push([x, y - 1]);
    }

    return neighbours;
}

async function wait() {
    return new Promise(resolve => setTimeout(resolve, 100));
}

async function Astar(start, end)
{
    let queue = new Queue();
    let GScores = getMatrix(n, -1);

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

        let neighbours = getNeigbors(current, matrix, GScores);
        for (let i = 0; i < neighbours.length; i++)
        {
            let neigbor = neighbours[i];


            await wait();
            context.fillStyle = "#cdcdcd";
            context.fillRect(neigbor[1] * cube + 1, neigbor[0] * cube + 1, cube - 1, cube - 1);

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
    context.fillStyle = "red";
    context.fillRect(end[1] * cube, end[0] * cube, cube - 1, cube - 1);
    if (JSON.stringify(parents[end[0]][end[1]]) !== JSON.stringify([-1, -1]))
    {
        let cell = parents[end[0]][end[1]];
        while (cell[0] !== -1 && cell[1] !== -1)
        {
            context.fillStyle = "green";
            context.fillRect(cell[1] * cube, cell[0] * cube, cube - 1, cube - 1);
            cell = parents[cell[0]][cell[1]];
        }
        context.fillStyle = "blue";
        context.fillRect(start[1] * cube, start[0] * cube, cube - 1, cube - 1);
    }
    else
    {
        alert("Пути нет");
    }
}


