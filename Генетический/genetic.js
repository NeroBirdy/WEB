let vertexes = [];
let pathes = [];
let best_path = [];
let best_length = 100000000000;
let count = 0;
let fl = false;
let finish_algoritm = false;


let canvas = document.getElementById("myCanvas");
let c = canvas.getContext("2d");

canvas.addEventListener("click", function(event) {

    if (finish_algoritm)
    {
        c.clearRect(0, 0, canvas.width, canvas.height);
        finish_algoritm = false;
    }

    if (!fl)
    {
        let x = event.offsetX;
        let y = event.offsetY;
        vertexes.push({x: x, y: y});

        c.beginPath();
        c.arc(x, y, 5, 0, 5 * Math.PI);
        c.fillStyle = "black";
        c.fill();
    }
});
    

    function getFirtsPopulation()
    {
        for (let i = 0; i < 1000; i++)
        {
            let path = [];
            for(let j = 0; j < vertexes.length; j++)
            {
                path.push(j);
            }
            for(let j = 0; j < vertexes.length; j++)
            {
                let ind_f = Math.floor(Math.random() * vertexes.length);
                let ind_s = Math.floor(Math.random() * vertexes.length);

                while(ind_f === ind_s)
                {
                    ind_s = Math.floor(Math.random() * vertexes.length);
                }

                let temp = path[ind_f];
                path[ind_f] = path[ind_s];
                path[ind_s] = temp;

            }
            pathes.push(path);
        }
    }


    function Draw(path)
    {
        c.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < vertexes.length; i++)
        {
            c.beginPath();
            c.arc(vertexes[i].x, vertexes[i].y, 5, 0, 5 * Math.PI);
            c.fillStyle = "black";
            c.fill();
        }
        c.beginPath();
        for(let i = 0; i < path.length - 1; i++)
        {
            c.moveTo(vertexes[path[i]].x, vertexes[path[i]].y);
            c.lineTo(vertexes[path[i + 1]].x, vertexes[path[i + 1]].y);
        }
        c.moveTo(vertexes[path[0]].x, vertexes[path[0]].y);
        c.lineTo(vertexes[path[path.length - 1]].x, vertexes[path[path.length - 1]].y);
        c.stroke();
    }

    async function Genetic()
    {
        fl = true;
        for(let k = 0; k < 1000000; k++)
        {
            let dist = [];
            if (!pathes.length)
            {
                getFirtsPopulation();
            }
            for (let i = 0; i < 1000; i++)
            {
                let FirstFather = Math.floor(Math.random() * 1000);
                let SecondFather = FirstFather;

                while(FirstFather === SecondFather)
                {
                    SecondFather = Math.floor(Math.random() * 1000);
                }
                pathes.push(cross(pathes[FirstFather], pathes[SecondFather]));
            }

            for (let i = 0; i < 2000; i++)
            {
                dist.push(getDistance(pathes[i]));
            }

            Sort(dist);

            for (let i = 0; i < 1000; i++)
            {
                pathes.pop();
            }
            await new Promise(v => setTimeout(v, 10)); 
            if (JSON.stringify(best_path) === JSON.stringify(pathes[0]))
            {
                count++;
                if (count === 20)
                {
                    break;
                }
            }
            if (JSON.stringify(best_path) !== JSON.stringify(pathes[0]))
            {
                count = 0;
                best_path = pathes[0].slice();
            }
            Draw(pathes[0]);
        }
        console.log("Готово")
        finish_algoritm = true;
        vertexes = [];
        pathes = [];
        best_path = [];
        best_length = 100000000000;
        count = 0;
        fl = false;
        
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
        let break_line = Math.floor(Math.random() * FirstFather.length);
        let gen = [];

        for(let i = 0; i < break_line; i++)
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
