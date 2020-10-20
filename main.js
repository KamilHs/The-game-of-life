let canvas;
let ctx;

let CELL_COUNT;
let WIDTH;
let SPEED;


let grid = createGrid();
let next;

Array.prototype.clone = function () {
    const copy = [];

    for (let i = 0; i < CELL_COUNT; i++) {
        copy[i] = [];
        for (let j = 0; j < CELL_COUNT; j++) {
            copy[i][j] = { ...this[i][j] };
        }
    }
    return copy;
}


function renderDom() {
    document.body.innerHTML += `
    <div class="settings">
    <form action="#">
        <div class="form-group">
            <label for="size">Enter grid size</label>
            <input type="range" class="form-control-range" name="size" value="50" id="size" min="10" max="200">
        </div>
        <div class="form-group">
            <label for="speed">Enter speed of game</label>
            <input type="range" class="form-control-range" name="speed" value="900" id="speed" min="1" max="1000">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>`;

    document.body.querySelector('button').addEventListener('click', function (e) {
        e.preventDefault();

        speed = +document.querySelector('#speed').getAttribute('max') - +document.querySelector('#speed').value;
        CELL_COUNT = +document.querySelector('#size').value;

        document.body.removeChild(document.body.lastElementChild);

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        canvas.width = document.documentElement.clientHeight;
        canvas.height = document.documentElement.clientHeight;

        if (window.innerWidth < window.innerHeight) {
            canvas.width = document.documentElement.clientWidth;
            canvas.height = document.documentElement.clientWidth;

        }
        document.body.appendChild(canvas)

        WIDTH = canvas.width / CELL_COUNT;

        clear();

        grid = createGrid();
        next;

        const interval = setInterval(() => {
            game();
        }, speed);

    })
}


function clear() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw() {
    clear();
    ctx.fillStyle = "black"
    for (let i = 0; i < CELL_COUNT; i++) {
        for (let j = 0; j < CELL_COUNT; j++) {
            ctx.beginPath();
            ctx.rect(WIDTH * j, WIDTH * i, WIDTH, WIDTH);
            if (grid[i][j].state) {
                if (grid[i][j].liveDuration < 255)
                    ctx.fillStyle = `rgb(${grid[i][j].liveDuration % 256},0,0)`;
                else if (grid[i][j].liveDuration < 510)
                    ctx.fillStyle = `rgb(0,${grid[i][j].liveDuration % 256},0)`;
                else if (grid[i][j].liveDuration < 765)
                    ctx.fillStyle = `rgb(0,0,${grid[i][j].liveDuration % 256})`;
                else
                    ctx.fillStyle = `rgb(255,0,255)`;
                ctx.fill();
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}


function game() {
    next = grid.clone();
    for (let i = 0; i < CELL_COUNT; i++) {
        for (let j = 0; j < CELL_COUNT; j++) {
            let live = getNeighbours(i, j).reduce((acc, val) => acc + grid[val.row][val.col].state, 0);
            let isAlive = grid[i][j].state;

            if (isAlive && (live < 2 || live > 3)) {
                next[i][j].state = 0;
                next[i][j].liveDuration = 0;
            }
            else if (isAlive) next[i][j].liveDuration++;
            else if (!isAlive && live == 3) {
                next[i][j].state = 1;
                next[i][j].liveDuration++;
            }
        }
    }

    grid = next.clone();
    draw();
}


function createGrid() {
    const grid = new Array(CELL_COUNT);

    for (let i = 0; i < CELL_COUNT; i++) {
        grid[i] = [];
        for (let j = 0; j < CELL_COUNT; j++)
            grid[i].push({
                state: Math.random() < 0.4 ? 1 : 0,
                liveDuration: 0,
            });
    }

    return grid;
}


function getNeighbours(row, col) {
    let neighbours = [];

    neighbours.push({ row: row - 1, col: col - 1 })
    neighbours.push({ row: row - 1, col: col })
    neighbours.push({ row: row - 1, col: col + 1 })
    neighbours.push({ row: row, col: col + 1 })
    neighbours.push({ row: row + 1, col: col + 1 })
    neighbours.push({ row: row + 1, col: col })
    neighbours.push({ row: row + 1, col: col - 1 })
    neighbours.push({ row: row, col: col - 1 })

    return neighbours.filter(cell => cell.col >= 0 && cell.col < CELL_COUNT && cell.row >= 0 && cell.row < CELL_COUNT);
}

renderDom();