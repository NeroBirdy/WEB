window.onload = function () //что бы картинки и мб анимации закинуть на всяки пожарный пусть будет
{
    let gens = [];
    const canvas = document.getElementById('myCanvas');
    const c = canvas.getContext('2d');
    document.querySelector("#place_point").onclick = function () 
    {
        const fon = document.getElementById('fon');
        canvas.addEventListener('mouseup', function (a) 
        {
            let x = a.pageX - fon.offsetLeft,
                y = a.pageY - fon.offsetTop;
            gens.push([x, y])
            const gen = document.createElement('img')
            gen.src = 'gen.png'
            gen.height = 60  //размер гены
            gen.width = 60
            gen.classList.add("gens");
            gen.id = String(gens.length - 1)
            gen.style.position = 'absolute'  //клеим гены
            gen.style.marginTop = (y - 25) + 'px'
            gen.style.marginLeft = (x - 25) + 'px'
            fon.appendChild(gen)
        }
        );
    }
    document.querySelector("#create_put").onclick = function () //путь
    {
        let rast = [] //растояние
        for (let i = 0; i < gens.length; i++) 
        {
            rast[i] = []
            for (let j = 0; j < gens.length; j++) 
            {
                let f_point = gens[i]
                let s_point = gens[j]
                rast[i][j] = Math.sqrt(((f_point[0] - s_point[0]) ** 2) + ((f_point[1] - s_point[1]) ** 2)) //f-first s-sekond
            }
        }
        function fit(mas) //фитнес
        {
            let weight = 0
            for (let i = 0; i < mas.length - 1; i++) 
            {
                weight = weight + rast[mas[i]][mas[i + 1]]
            }
            weight = weight + rast[0][mas.length - 1]
            return weight
        }
        function sort_pop(pop, mn, mx) //сортировка популяции
        {
            if (mn < mx) 
            {
                let left, right, mid
                left = mn
                right = mx
                mid = pop[Math.floor(Math.random() * (right - left)) + left][0]
                do //да я опять использую ду вайл и что (для влада)
                {
                    while (pop[left][0] < mid) 
                    {
                        left++;
                    }
                    while (pop[right][0] > mid) 
                    {
                        right--;
                    }
                    if (left <= right) 
                    {
                        let r = pop[left]
                        pop[left] = pop[right]
                        pop[right] = r
                        left++
                        right--
                    }
                } while (left < right);
                sort_pop(pop, mn, right)
                sort_pop(pop, left, mx)
            }
        }
        function mut(individ) //мутация
        {
            let mut_proc = 5 //%
            let random_proc = Math.floor(Math.random() * (101));
            if (random_proc <= mut_proc) {
                let f_ind = Math.floor(Math.random() * (individ.length - 1)) + 1
                let s_ind = -1
                while (s_ind === -1) //всей душой ненавижу жс за эти === я == и = путаю вечно, а тут еще одно добавилось
                {
                    let ind = Math.floor(Math.random() * (individ.length - 1)) + 1
                    if (ind !== f_ind)
                    {
                        s_ind = ind
                    }
                }
                let r = individ[f_ind]
                individ[f_ind] = individ[s_ind]
                individ[s_ind] = r
            }
            individ.shift() //удаляем 0
            individ.unshift(fit(individ)) //закидываем вначало
        }
        function cross(pop) //переесеч
        {
            let f_individ = pop[0]
            let s_individ = pop[1]
            let break_point = Math.round(((f_individ.length) / 2))
            let f_pot = []  //это потомптво не путать с популяцией
            let s_pot = []
            let f_vizit = []
            let s_vizit = []
            for (let i = 1; i < f_individ.length; i++) {
                if (i < break_point) 
                {
                    f_pot.push(f_individ[i])
                    f_vizit.push(f_individ[i])
                    s_pot.push(s_individ[i])
                    s_vizit.push(s_individ[i])
                } else {
                    if (f_vizit.includes(s_individ[i]) === false) 
                    {
                        f_pot.push(s_individ[i])
                        f_vizit.push(s_individ[i])
                    }
                    if (s_vizit.includes(f_individ[i]) === false) 
                    {
                        s_pot.push(f_individ[i])
                        s_vizit.push(f_individ[i])
                    }
                }
            }
            for (let j = 1; j < f_individ.length; j++) {
                if (f_pot.includes(f_individ[j]) === false) 
                {
                    f_pot.push(f_individ[j])
                }
                if (s_pot.includes(s_individ[j]) === false) {
                    s_pot.push(s_individ[j])
                }
            }
            f_pot.unshift(fit(f_pot))
            s_pot.unshift(fit(s_pot))
            pop.push(f_pot)
            pop.push(s_pot)
            sort_pop(pop, 0, pop.length - 1)
            pop.splice(-1, 1) //удаляем элемент по индексу -1
            pop.splice(-1, 1)
        }
        function random_put(point_count) {
            let points = []
            while (points.length !== point_count) 
            {
                let point = Math.floor(Math.random() * point_count)
                if (points.includes(point) === false) 
                {
                    points.push(point)
                }
            }
            return points
        }
        function create_pop(gens) 
        {
            let pop_size = gens.length * 2
            let pop = []
            while (pop.length < pop_size) 
            {
                let put = random_put(gens.length)
                if (pop.includes(put) === false)
                {
                    pop.push(put)
                }
            }
            for (let i = 0; i < pop_size; i++) 
            {
                pop[i].unshift(fit(pop[i]))
            }
            sort_pop(pop, 0, pop.length - 1)
            return pop
        }
        if (gens.length > 1) 
        {
            let pop = create_pop(gens)
            let best_put = -1

            async function find_put() 
            {
                for (let i = 0; i < Math.pow(gens.length, 4); i++) 
                {
                    c.beginPath();
                    cross(pop)
                    for (let j = 0; j < pop.length; j++) 
                    {
                        mut(pop[j])
                    }
                    sort_pop(pop, 0, pop.length - 1)
                    if (pop[0][0] !== best_put) {
                        best_put = pop[0][0]
                        c.clearRect(0, 0, canvas.width, canvas.height);
                        let start_x = gens[pop[0][1]][0]
                        let start_y = gens[pop[0][1]][1]
                        c.moveTo(start_x, start_y)
                        for (let k = 2; k < pop[0].length; k++)
                        {
                            let x = gens[pop[0][k]][0]
                            let y = gens[pop[0][k]][1]
                            c.lineTo(x, y)
                        }
                        c.closePath();
                        c.strokeStyle = '#ea2121'
                        c.stroke();
                        //await new Promise(v => setTimeout(v, 100)); //скорость
                    }
                }
            }
            find_put()
        }
        console.log("Готово")
    }
    document.querySelector('#clear').onclick = function ()  //пофакту бесполезная кнопка проще перезагрузить страницу
    {
        c.clearRect(0, 0, canvas.width, canvas.height);
        document.querySelectorAll('.gens').forEach(function (a) 
        {
            a.remove()
        }
        )
        gens = []
    }
}