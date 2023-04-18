function aStar(start, end, adjacencyMatrix) {
    const n = 9;
    const visited = new Array(n).fill(false);
    const cost = new Array(n).fill(Infinity);
    const heuristic = new Array(n).fill(0);
    const path = new Array(n).fill(null);
  
    cost[start] = 0;
    visited[start] = true;
  
    const queue = [start];
  
    while (queue.length > 0) {
      const current = queue.shift();
  
      if (current === end) {
        const result = [];
        let node = end;
        while (node !== start) {
          result.push(node);
          node = path[node];
        }
        result.push(start);
        return [result.reverse(), cost[end]];
      }
  
      for (let i = 0; i < n; i++) {
        if (adjacencyMatrix[current][i] !== 0 && !visited[i]) {
          const newCost = cost[current] + adjacencyMatrix[current][i];
          if (newCost < cost[i]) {
            cost[i] = newCost;
            heuristic[i] = newCost + distance(i, end);
            path[i] = current;
            visited[i] = true;
            queue.push(i);
          }
        }
      }
    }
  
    return null;
  }
  
  function distance(a, b) {
    return Math.abs(a - b);
  }
  
  const graph = [
    0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  
//   const [path, dist] = aStar(0, 8, graph);
  
//   console.log(`Кратчайший путь: ${path}`);
//   console.log(`Расстояние: ${dist}`);
console.log(aStar(0,8))
  