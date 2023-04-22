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

    let cellY = i * cube;
    let cellX = j * cube;
    switch(operation)
    {
        case 0:
            if (start[0] === i && start[1] == j)
            {
                start = [-1, -1];
            }
            if (end[0] === i && end[1] == j)
            {
                end = [-1, -1];
            }
            if (matrix[i][j])
            {
                matrix[i][j] = 0;
                context.fillStyle = "#ffffff";
                context.fillRect(cellY + 0.5 , cellX + 0.5, cube - 1, cube - 1);
            }
            else
            {
                matrix[i][j] = 1;
                context.fillStyle = "#000000";
                context.fillRect(cellY, cellX, cube, cube);
            }
            break;

        case 1:
            if (matrix[i][j]){
                matrix[i][j] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(CellY * cube + 0.5, CellX * cube + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify(start) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(start[0] * cube + 0.5, start[1] * cube + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(end)){
                context.fillStyle="#ffffff";
                context.fillRect(end[0] * cube + 0.5, end[1] * cube + 0.5, cube - 1, cube - 1);
                end = [-1, -1];
            }

            context.fillStyle="blue";
            context.fillRect(cellY + 0.5, cellX + 0.5, cube - 1, cube - 1);
            start[0] = i;
            start[1] = j;
            break;

        case 2:
            if (matrix[i][j])
            {
                matrix[i][j] = 0;
                context.fillStyle = "#ffffff";
                context.fillRect(cellY + 0.5 , cellX + 0.5, cube - 1, cube - 1);
            }
            if (JSON.stringify([j, i]) === JSON.stringify(start)){
                context.fillStyle="#ffffff";
                context.fillRect(start[0] * cube + 0.5, start[1] * cube * cube + 0.5, cube - 1, cube - 1);
                start = [-1, -1];
            }
            if (JSON.stringify(end) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(end[0] * cube + 0.5, end[1] * cube + 0.5, cube - 1, cube - 1);
            }

            context.fillStyle="red";
            context.fillRect(cellY + 0.5, cellX + 0.5, cube - 1, cube - 1);
            end[0] = i;
            end[1] = j;
            break;
    }

}





