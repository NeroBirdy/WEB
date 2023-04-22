const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function createMap()
{
    let n = document.getElementById("input").value;
    context.clearRect(0, 0, 500, 500);
    context.beginPath();
    let cube = 500 / n;
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
}


function Click(event)
{
    let x = event.target.offsetLeft;
    let y = event.target.offsetTop;


}





