let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

const bodySize = document.body.getBoundingClientRect();
if(bodySize.width <= 450){
    var size = Math.min(bodySize.width, bodySize.height) * 0.7;
}
else if(bodySize.width <= 800){
    var size = Math.min(bodySize.width, bodySize.height) * 0.82;
}
else{
    var size = Math.min(bodySize.width, bodySize.height) * 0.9;
}
canvas.setAttribute('width', size);
canvas.setAttribute('height', size);


let visited = [];
let clasters = [];
let centers = [];
let dots = [];
let colors = [
  "red",
  "yellow",
  "lime",
  "white",
  "blue",
  "orange",
  "purple",
  "pink",
  "SandyBrown",
  "DarkSlateGray",
  "Navy",
  "DarkTurquoise",
  "Plum",
  "Tomato",
  "Salmon",
  "Indigo",
  "Olive",
  "Maroon",
  "DimGray",
  "Beige",
  "Tan"
];

context.fillStyle = "#dbdbdb";
context.fillRect(0, 0, canvas.width, canvas.height);


function addCenter() {
let ind = Math.floor(Math.random() * dots.length);
while (visited.includes(ind))
{
  ind = Math.floor(Math.random() * dots.length);
}
centers.push([dots[ind][0], dots[ind][1]]);
}

canvas.addEventListener("click", function(event) {

let x = event.offsetX;
let y = event.offsetY;
dots.push([x, y]);

context.beginPath();
context.arc(x, y, 5, 0, 2 * Math.PI);
context.fillStyle = "black";
context.fill();
});


function getDistance(cur, end)
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
            let distance = getDistance(dots[i],centers[j]);
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


function  recontruction(clasters)
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
  centers = []; 
  visited = [];
  if (document.getElementById("countcenters").value < 2)
  {
    alert("Нужно как минимум 2 кластера");
    return;
  }
  if (document.getElementById("countcenters").value > 21)
  {
    alert("Слишком много кластеров, максимум 21");
    return;
  }
  if (dots.length < document.getElementById("countcenters").value)
  {
    alert("Слишком мало точек для стольких кластеров");
    return;
  }
  for (let i = 0; i < document.getElementById("countcenters").value; i++)
  {
    addCenter();
  }
    clasters = assignClusters(dots, centers);
    let newCenters =  recontruction(clasters);
    while (JSON.stringify(newCenters) !== JSON.stringify(centers))
    {
        centers = newCenters;
        clasters = assignClusters(dots, centers);
        newCenters =  recontruction(clasters);
    }
    context.beginPath();
    context.fillStyle = "#dbdbdb";
    context.fillRect(0, 0, canvas.width, canvas.height);

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
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#dbdbdb";
    context.fillRect(0, 0, canvas.width, canvas.height);
    dots = [];
    centers = [];
    clasters = [];
}


function DBSCAN(dots, eps, minPts) {
  if (dots.length < 2)
  {
    alert("Надо бы поставить хотя бы две точки");
    return;
  }

  let clusterIdx = 0;
  let visited = new Set();
  let cluster = new Array(dots.length);
  for (let i = 0; i < dots.length; i++) {
    cluster[i] = -1;
  }

  function regionQuery(curDot) {
    let neighbors = [];
    for (let i = 0; i < dots.length; i++) {
      if (i !== curDot && getDistance(dots[curDot], dots[i]) <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  function expandCluster(curDot, curCluster) {
    cluster[curDot] = curCluster;
    let neighbors = regionQuery(curDot);
    for (let i = 0; i < neighbors.length; i++) {
      let nextDot = neighbors[i];
      if (!visited.has(nextDot)) {
        visited.add(nextDot);
        let nextNeighbors = regionQuery(nextDot);
        if (nextNeighbors.length >= minPts) {
          neighbors = neighbors.concat(nextNeighbors);
        }
      }
      if (cluster[nextDot] === -1) {
        cluster[nextDot] = curCluster;
      }
    }
  }

  for (let i = 0; i < dots.length; i++) {
    if (!visited.has(i)) {
      visited.add(i);
      let neighbors = regionQuery(i);
      if (neighbors.length < minPts) {
        cluster[i] = -1;
      } else {
        cluster[i] = clusterIdx;
        expandCluster(i, clusterIdx);
        clusterIdx++;
      }
    }
  }


  context.clearRect(0, 0, 1200, 900);
  context.fillStyle = "#dbdbdb";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < cluster.length; i++)
  {
    if (cluster[i] !== -1)
    {
      context.beginPath();
      context.arc(dots[i][0], dots[i][1], 5, 0, 2 * Math.PI);
      context.fillStyle = colors[cluster[i]];
      context.fill();
    }
    else
    {
      context.beginPath();
      context.arc(dots[i][0], dots[i][1], 5, 0, 2 * Math.PI);
      context.fillStyle = "black";
      context.fill();
    }
  }
}

function hierarchicalClustering(data) {
  if (document.getElementById("countcenters").value < 2)
  {
    alert("Нужно как минимум 2 кластера");
    return;
  }
  if (document.getElementById("countcenters").value > 21)
  {
    alert("Слишком много кластеров, максимум 21");
    return;
  }
  if (dots.length < document.getElementById("countcenters").value)
  {
    alert("Слишком мало точек для стольких кластеров");
    return;
  }
  let k = document.getElementById("countcenters").value;
  let clusters = [];
  for (let i = 0; i < data.length; i++) {
    clusters.push([data[i]]);
  }

  while (clusters.length > k) {
    let minDist = Infinity;
    let merge = [-1, -1];

    for (let i = 0; i < clusters.length - 1; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        let dist = euclideanDistance(clusters[i], clusters[j]);
        if (dist < minDist) {
          minDist = dist;
          merge = [i, j];
        }
      }
    }

    clusters[merge[0]] = clusters[merge[0]].concat(clusters[merge[1]]);
    clusters.splice(merge[1], 1);
  }

  context.clearRect(0, 0, 1200, 900);
  context.fillStyle = "#dbdbdb";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < clusters.length; i++)
  {
    if (clusters[i].length)
    {
      for (let j = 0; j < clusters[i].length; j++)
    {
      let x = clusters[i][j][0];
      let y = clusters[i][j][1];
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = colors[i];
      context.fill();
    }
    }

  }
}

function euclideanDistance(cluster1, cluster2) {
  let dist = Infinity;
  for (let i = 0; i < cluster1.length; i++) {
    for (let j = 0; j < cluster2.length; j++) {
      let d = getDistance(cluster1[i], cluster2[j]);
      if (d < dist) {
        dist = d;
      }
    }
  }
  return dist;
}

