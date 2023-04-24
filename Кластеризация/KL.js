let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let clasters = [];
let centers = [];
let dots = [];
let colors = [];

context.beginPath();
context.fillStyle = "#dbdbdb";
context.fillRect(0, 0, canvas.width, canvas.height);


function addDot() {
// Получаем случайные координаты для зеленой точки
let x = Math.floor(Math.random() * canvas.width);
let y = Math.floor(Math.random() * canvas.height);
let color = "#" + Math.floor(Math.random()* 16777215).toString(16);
colors.push(color);
centers.push([x, y]);


// Рисуем точку(Центр кластера)
context.beginPath();
// context.arc(x, y, 10, 0, 2 * Math.PI);
context.fillStyle = color;
context.fillRect(x,y, 20,20);
}

canvas.addEventListener("click", function(event) {
// Получаем координаты клика canvas
let x = event.offsetX;
let y = event.offsetY;
dots.push([x,y]);



// Рисуем точку в месте клика
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
    //let newDots = [];
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
        // for(let j = 0; j < clasters[i].length; j++)
        // {
        //     let newDotX = (clasters[i][j][0] + newCenterX) / 2;
        //     let newDotY = (clasters[i][j][1] + newCenterY) / 2;
        //     newDots.push([newDotX, newDotY]);
        // }
    }
    // dots = newDots;
    return newCenters;
}

function KMeans()
{
    let count = 0;
    //console.log(dots);
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
    //context.clearRect(0, 0, canvas.width,canvas.height);
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
            context.arc((clasters[i][j][0] + centers[i][0]) / 2, (clasters[i][j][1] + centers[i][1]) / 2, 5, 0, 2 * Math.PI);
            context.fillStyle = colors[i];
            context.fill();
        }
        
    }
    //console.log(clasters)
}
