let data = [];



function parseCsv()
{
    let file = document.getElementById("input_file");
    let a = [];
    a = file.files[0];
    const reader = new FileReader();
    reader.readAsText(file.files[0]);
    reader.onload = function()
    {
        let text = reader.result;
        for(let i = 0; i < text.length; i++)
        {
            let row = "";
            while(text[i] != "\n")
            {
                row += text[i];
                i++;
            }
            row = row.slice(0, -1);
            data.push(row.split(/,(?!\s)/));
        }
        console.log(data);
    }

}