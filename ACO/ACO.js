let canvas = document.getElementById("myCanvas");
let c = canvas.getContext("2d");

canvas.addEventListener("click", function(event) {

    if (!end && countCities < 50)
    {
        if (vertexes.length)
        {
            c.clearRect(0, 0, canvas.width, canvas.height);
            for(let i = 0; i < vertexes.length; i++)
            {
                c.beginPath();
                c.arc(vertexes[i].x, vertexes[i].y, 6, 0, 5 * Math.PI);
                c.fillStyle = "black";
                c.fill();
        }
        }
        let x = event.offsetX;
        let y = event.offsetY;
        vertexes.push({x: x, y: y});

        c.beginPath();
        c.arc(x, y, 6, 0, 5 * Math.PI);
        c.fillStyle = "black";
        c.fill();
        countCities++;
    }
    if (countCities == 50 )
    {
        alert("Столько городов будет достаточно")
    }
});

let countAnts = 0;
let countCities = 0;
let vertexes = [];
let distances = [];
let pheromones = [];

let alpha = 2;
let beta = 3;
let end = false;
let finish = false;


class Ant
{
    path = [];
    pathlength = Infinity;
    visited = [];
    current = null
}


async function ACO()
{
    end = true;
    let count = 0;
    let bestPath = [];
    let bestLength = Infinity;

    distances = getDist();
    pheromones = [];
    let ants = [];
    for(let i = 0; i < 100; i++)
    {
        ants.push(new Ant);
    }
    pheromones = getFirstPheromones();

    for (let i = 0; i < 1000000; i++)
    {
        ants = getAnts(ants);

        for (let k = 0; k < vertexes.length - 1; k++)
        {
            for (let j = 0; j < ants.length; j++)
            {
                let next = selectNext(ants[j],);
                ants[j].path.push(next);
                ants[j].visited[next] = true;
                ants[j].current = next;
            }
        }

        for (let k = 0; k < ants.length; k++)
        {
            ants[k].pathlength = getPath(ants[k].path);
            if (ants[k].pathlength < bestLength)
            {
                bestLength = ants[k].pathlength;
                bestPath = ants[k].path.slice();
                count = 0;
                Draw(ants[k].path);
            }
        }

        updatePheromones(ants);

        await new Promise(resolve => setTimeout(resolve, 20));

        count++;
        if (count === 100)
        {
            finish = true;
            Draw(bestPath);
            console.log("Готово");
            break;
        }
    }
    
    end = false;
    finish = false;
}





function getDist()
{
    let distances = new Array(vertexes.length);
    for(let i = 0; i < vertexes.length; i++)
    {
        distances[i] = new Array(vertexes.length);
        for(let j = 0; j < vertexes.length; j++)
        {
            distances[i][j] = Math.sqrt(Math.pow(vertexes[i].x - vertexes[j].x , 2) + Math.pow(vertexes[i].y - vertexes[j].y , 2));
        }
    }
    return distances;
}

function getFirstPheromones()
{
    let pheromones = [];
    for(let i = 0; i < vertexes.length; i++)
    {
        let p = [];
        for(let j = 0; j < vertexes.length; j++)
        {
            p.push(1);
        }
        pheromones.push(p);
    }
    return pheromones;
}


function getAnts(ants)
{
    for(let i = 0; i < 100; i++)
    {
        let start = Math.floor(Math.random() * vertexes.length);
        ants[i].path = [];
        ants[i].pathlength = Infinity;
        ants[i].visited = new Array(vertexes.length).fill(false);
        ants[i].path.push(start);
        ants[i].visited[start] = true;
        ants[i].current = start;
    }
    return ants;
}

function selectNext(ant)
{
    let current = ant.current;
    let probabilities = [];
    let totalprobability = 0;
    let visited = ant.visited;

    for (let i = 0; i < vertexes.length; i++)
    {
        if(!visited[i])
        {
            let pheromone = pheromones[current][i];
            let distance = distances[current][i];
            let probability = pheromone ** alpha * (1 / distance) ** beta;
            probabilities.push({vertex: i, probability: probability});
            totalprobability += probability;
        }
    }

    let random = Math.random() * totalprobability;
    let probSum = 0;
    for (let i = 0; i < probabilities.length; i++)
    {
        probSum += probabilities[i].probability;
        if (random <= probSum)
        {
            return probabilities[i].vertex;
        }
    }
    return probabilities[0].vertex;
}

function getPath(path)
{
    let len = distances[path[0]][path[path.length - 1]];
    for (let i = 0; i < path.length - 1; i++)
    {
        len += distances[path[i]][path[i + 1]];
    }
    return len;
}

function updatePheromones(ants)
{
    for (let i = 0; i < pheromones.length; i++)
    {
        for(let j = 0; j < pheromones.length; j++)
        {
            pheromones[i][j] *= 0.4;
        }
    }

    for(let i = 0; i < ants.length; i++)
    {
        let ant = ants[i];
        let pathlength = ant.pathlength;

        let deltaPher = 1 / pathlength;
        for(let j = 0; j < ant.path.length - 1; j++)
        {
            let ver1 = ant.path[j];
            let ver2 = ant.path[j + 1];
            pheromones[ver1][ver2] += deltaPher;
            pheromones[ver2][ver1] += deltaPher;
        }
    }

}



    
function DeletePath()
{
    c.clearRect(0, 0, 800, 800);
    for (let i = 0; i < vertexes.length; i++)
    {
        c.beginPath();
        c.arc(vertexes[i].x, vertexes[i].y, 6, 0, 5 * Math.PI);
        c.fillStyle = "black";
        c.fill();
    }
}


function Draw(path)
{
    if (finish)
    {
        c.lineWidth = 4;
        c.strokeStyle = "white";
    }
    else
    {
        c.lineWidth = 2;
        c.strokeStyle = "black";
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    for(let i = 0; i < path.length - 1; i++)
    {
        c.moveTo(vertexes[path[i]].x, vertexes[path[i]].y);
        c.lineTo(vertexes[path[i + 1]].x, vertexes[path[i + 1]].y);
    }
    c.moveTo(vertexes[path[0]].x, vertexes[path[0]].y);
    c.lineTo(vertexes[path[path.length - 1]].x, vertexes[path[path.length - 1]].y);
    c.stroke();
    for(let i = 0; i < vertexes.length; i++)
    {
        c.beginPath();
        c.arc(vertexes[i].x, vertexes[i].y, 6, 0, 5 * Math.PI);
        c.fillStyle = "black";
        c.fill();
    }
}
