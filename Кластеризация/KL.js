let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let clasters = [];
let centers = [];
let dots = [];
let colors = [];

context.fillStyle = "#dbdbdb";
context.fillRect(0, 0, canvas.width, canvas.height);


function addDot() {

let x = Math.floor(Math.random() * canvas.width);
let y = Math.floor(Math.random() * canvas.height);
let color = "#" + Math.floor(Math.random()* 16777215).toString(16);
colors.push(color);
centers.push([x, y]);
context.fillStyle = color;
context.fillRect(x,y, 20,20);
context.fillStyle = "black";
}

canvas.addEventListener("click", function(event) {

let x = event.offsetX;
let y = event.offsetY;
dots.push([x,y]);

context.beginPath();
context.arc(x, y, 5, 0, 2 * Math.PI);
context.fillStyle = "black";
context.fill();
});


function get_distance(cur, end)
{
    return Math.sqrt(Math.pow(end[0] - cur[0], 2) + Math.pow(end[1] - cur[1], 2));
}

function assignClusters(dots, centers)
{
    let clasters = new Array(centers.length);
    for (let i = 0; i < centers.length; i++)
    {
        clasters[i] = [];
    }
    for (let i = 0; i < dots.length; i++)
    {
        let dist = [];
        for (let j = 0; j < centers.length; j++)
        {
            let distance = get_distance(dots[i],centers[j]);
            dist.push(distance);
        }
        let index = 0;
        for(let j = 0; j < dist.length; j++)
        {
            if (dist[j] < dist[index])
            {
                index = j;
            }
        }
        clasters[index].push(dots[i]);
    }
    return clasters;
}


function recontrucrion(clasters)
{
    let newCenters = [];
    for (let i = 0; i < clasters.length; i++)
    {
        let sumX = 0;
        let sumY = 0;
        for(let j =0; j < clasters[i].length; j++)
        {
            sumX += clasters[i][j][0];
            sumY += clasters[i][j][1];
        }
        let newCenterX = sumX / clasters[i].length;
        let newCenterY = sumY / clasters[i].length;
        newCenters.push([newCenterX,newCenterY]);
    }
    return newCenters;
}

function KMeans()
{
    let count = 0;
    clasters = assignClusters(dots, centers);
    let newCenters = recontrucrion(clasters);
    while (JSON.stringify(newCenters) !== JSON.stringify(centers))
    {
        count++;
        centers = newCenters;
        clasters = assignClusters(dots, centers);
        newCenters = recontrucrion(clasters);
    }
    console.log(count)
    context.beginPath();
    context.fillStyle = "#cdcdcd";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < centers.length; i++)
    {
        context.fillStyle = colors[i];
        context.fillRect(centers[i][0], centers[i][1], 20, 20);
    }

    for(let i = 0; i < clasters.length; i++)
    {
        for (let j = 0; j < clasters[i].length; j++)
        {
            context.beginPath();
            context.arc((clasters[i][j][0]), (clasters[i][j][1]) , 5, 0, 2 * Math.PI);
            context.fillStyle = colors[i];
            context.fill();
        } 
    }
}


function CleareMap()
{
    context.clearRect(0, 0, 1200, 900);
    context.fillStyle = "#dbdbdb";
    context.fillRect(0, 0, canvas.width, canvas.height);
    dots = [];
    centers = [];
    clasters = [];
    colors = [];
}