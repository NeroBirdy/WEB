function Astar(NodeStart,NodeEnd, walls)
{
  let openSet = [NodeStart];
  let closedSet = [];
  NodeStart.g = 0;
  NodeStart.f = NodeStart.g + heuristic(NodeStart,NodeEnd);
  
  while(openSet.length > 0)
  {

      let currentNode = get_lowest_f(openSet);

      if (currentNode.x === NodeEnd.x && currentNode.y === NodeEnd.y)
      {
        console.log(closedSet.length)
        console.log("Путь найден")

        return reconstructPath(currentNode);
      }

      openSet = openSet.filter((node) => node !== currentNode);
      closedSet.push(currentNode);

      let neighbors = get_neighbors(currentNode.x,currentNode.y,walls);
      for(let i = 0; i < neighbors.length; i++)
      {
        let TentativeScore = currentNode.g + heuristic(currentNode, neighbors[i]);
        if (closedSet.includes(neighbors[i]) && TentativeScore >= neighbors[i].g)
          continue;
        if (!closedSet.includes(neighbors[i]) || TentativeScore < neighbors[i].g)
        {
          neighbors[i].parent = currentNode;
          neighbors[i].g = TentativeScore;
          neighbors[i].f = neighbors[i].g + heuristic(neighbors[i],NodeEnd);
          if (!openSet.includes(neighbors[i]))
            openSet.push(neighbors[i]);
        }
      }
  }

  console.log("Путь не найден");
  return;
}


function reconstructPath(node) {
  let path = [node];
  
  while (node.parent) {
    node = node.parent;
    path.unshift(node);
  }
  
  return path;
}


function get_neighbors(x,y,walls)
{
  let neighbors = [];

  if (x > 0 && walls[x - 1][y] === 0)
  {
    neighbors.push(new Node(x - 1, y));
  }
  if (y > 0 && walls[x][y - 1] === 0)
  {
    neighbors.push(new Node(x, y - 1));
  }
  if (x < walls.length - 1 && walls[x + 1][y] === 0)
  {
    neighbors.push(new Node(x + 1, y));
  }
  if (y < walls.length - 1 && walls[x][y + 1] === 0)
  {
    neighbors.push(new Node(x, y + 1));
  }


  if (x > 0 && y > 0 && walls[x - 1][y - 1] === 0)
  {
    neighbors.push(new Node(x - 1, y - 1));
  }
  if (x > 0 && y < walls.length - 1 && walls[x - 1][y + 1] === 0)
  {
    neighbors.push(new Node(x - 1, y + 1));
  }
  if (x < walls.length - 1 && y > 0 && walls[x + 1][y - 1] === 0)
  {
    neighbors.push(new Node(x + 1, y - 1));
  }
  if (x < walls.length - 1 && y < walls.length - 1 && walls[x + 1][y + 1] === 0)
  {
    neighbors.push(new Node(x + 1, y + 1));
  }

  return neighbors;
}



function get_lowest_f(nodes) {
    let lowestIndex = 0;
    
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].f < nodes[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    
    return nodes[lowestIndex];
  }



function heuristic(currentNode, NodeEnd)
{ 
  let d1 = Math.abs(currentNode.x - NodeEnd.x);
  let d2 = Math.abs(currentNode.y - NodeEnd.y);
  return d1 + d2;
}

class Node
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.parent = null;
    this.g = Infinity;
    this.f = Infinity;
  }
}

let walls = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];

let NodeStart = new Node(0, 0);
let NodeEnd = new Node(4, 4);
let path = Astar(NodeStart,NodeEnd, walls);
for (let i = 0; i < path.length; i++)
{
  console.log(path[i].x, " ", path[i].y);
}