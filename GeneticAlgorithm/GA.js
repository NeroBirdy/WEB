let vertexes = [];
let pathes = [];
let bestPath = [];
let count = 0;
let end = false;
let finish = false;


let button1 = document.getElementById("Slider1");
let button2 = document.getElementById("Slider2");

button1.addEventListener("input", function()
{
    Fathers = parseInt(button1.value);
    document.getElementById("value_first").innerHTML = Fathers;
})
button2.addEventListener("input", function()
{
    Childs = parseInt(button2.value);
    document.getElementById("value_second").innerHTML = Childs;
})


let Fathers = 2400;
let Childs = 2400;
let time = 10;

let canvas = document.getElementById("myCanvas");
let c = canvas.getContext("2d");


function clearMap()
{
    vertexes = [];
    pathes = [];
    bestPath = [];
    count = 0;
    c.clearRect(0,0,canvas.width,canvas.height);
}


canvas.addEventListener("click", function(event) {

    if (!end)
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
    }
});
    
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

function getFirtsPopulation()
{
    for (let i = 0; i < Fathers; i++)
    {
        let path = [];
        for(let j = 0; j < vertexes.length; j++)
        {
            path.push(j);
        }
        for(let j = 0; j < vertexes.length; j++)
        {
            let indF = Math.floor(Math.random() * vertexes.length);
            let indS = Math.floor(Math.random() * vertexes.length);

            while(indF === indS)
            {
                indS = Math.floor(Math.random() * vertexes.length);
            }

            let temp = path[indF];
            path[indF] = path[indS];
            path[indS] = temp;

        }
        pathes.push(path);
    }
}

async function Genetic()
{
    button1.disabled = true;
    button2.disabled = true;
    document.getElementById("create_put").disabled = true;
    document.getElementById("clear").disabled = true;
    fl = true;
    for(let k = 0; k < 1000000; k++)
    {
        let dist = [];
        if (!pathes.length)
        {
            getFirtsPopulation();
        }
        for (let i = 0; i < Childs; i++)
        {
            let FirstFather = Math.floor(Math.random() * Fathers);
            let SecondFather = Math.floor(Math.random() * Fathers);

            while(FirstFather === SecondFather)
            {
                SecondFather = Math.floor(Math.random() * Fathers);
            }
            pathes.push(cross(pathes[FirstFather], pathes[SecondFather]));
        }

        for (let i = 0; i < Fathers + Childs; i++)
        {
            dist.push(getDistance(pathes[i]));
        }

        Sort(dist);

        for (let i = 0; i < Childs; i++)
        {
            pathes.pop();
        }
        await new Promise(v => setTimeout(v, time)); 
        if (JSON.stringify(bestPath) === JSON.stringify(pathes[0]))
        {
            count++;
            if (count === 20)
            {
                console.log(k);
                console.log("Длина пути: " + dist[0])

                break;
            }
        }
        if (JSON.stringify(bestPath) !== JSON.stringify(pathes[0]))
        {
            count = 0;
            bestPath = pathes[0].slice();
        }
        Draw(pathes[0]);
    }
    console.log("Готово")
    finish = true;
    Draw(pathes[0]);
    finish = false;
    end = false;
    pathes = [];
    bestPath = [];
    button1.disabled = false;
    button2.disabled = false;
    document.getElementById("create_put").disabled = false;
    document.getElementById("clear").disabled = false;
}

function Sort(distances)
{
    for (let i = 0; i < distances.length; i++) {
        for (let j = i + 1; j < distances.length; j++) {
            if (distances[i] > distances[j]) {
                let temp = pathes[i];
                pathes[i] = pathes[j];
                pathes[j] = temp;
                temp = distances[i];
                distances[i] = distances[j];
                distances[j] = temp;
            }
        }
    }
}

function cross(FirstFather, SecondFather)
{
    let breakLine = Math.floor(Math.random() * FirstFather.length);
    let gen = [];

    for(let i = 0; i < breakLine; i++)
    {
        gen.push(FirstFather[i]);
    }

    for(let i = 0; i < FirstFather.length; i++)
    {
        if(!gen.includes(SecondFather[i]))
        {
            gen.push(SecondFather[i]);
        }
    }

    for(let i = 0; i < SecondFather.length; i++)
    {
        if(!gen.includes(FirstFather[i]))
        {
            gen.push(FirstFather[i]);
        }
    }

    mutate(gen);

    return gen;

}

function mutate(gen)
{
    let percentage = 100 * Math.random();

    if (percentage > 70)
    {
        let first = Math.floor(Math.random() * gen.length);
        let second = Math.floor(Math.random() * gen.length);
    while(first === second)
    {
        second = Math.floor(Math.random() * gen.length);
    }

    let temp = gen[first];
    gen[first] = gen[second];
    gen[second] = temp;
    }

    return gen;
}

function getDistance(path)
{
    let dist = distance(vertexes[path[0]], vertexes[path[path.length - 1]]); 

    for (let i = 0; i < path.length - 1; i++)
    {
        dist += distance(vertexes[path[i]], vertexes[path[i + 1]]);
    }

    return dist;
}

function distance(first, second)
{
    return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));   
}
