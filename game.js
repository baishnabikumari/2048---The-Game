const TILE_BG = {
    1: '#282828',
    2: '#2d2822',
    3: '#7a3e12',
    4: '#934814',
    5: '#a84e1a',
    6: '#b83820',
    7: '#7a6012',
    8: '#9a7a10',
    9: '#b89010',
    10: '#5a38a0',
    11: '#c8a830',
    12: '#147878',
    13: '#882060',
    14: '#183890',
    15: '#1e8040',
    16: '#901818',
};

function bgFor(v){
    return TILE_BG[Math.log2(v)] || '#602080';
}

function fgfor(v){
    return v <= 4 ? '#807060' : '#f0e8dc';
}

function fsFor(v, cell){
    const n = String(v).length;
    if (n <= 2) return Math.floor(cell * 0.46);
    if (n === 3) return Math.floor(cell * 0.36);
    if (n === 4) return Math.floor(cell * 0.28);
    return Math.floor(cell * 0.22);
}

function make4x4(){
    return Array(4).fill(null).map(() => Array(4).fill(0));
}

// drop 2 or 4 random empty cell [r,c]
function addRandoms(g){
    const free = [];
    g.forEach((row, r) => row.forEach((v, c) => {
        if (!v) free.push([r, c]);
    }));
    if(!free.length) return null;
    const [r, c] = free[Math.floor(Math.random() * free.length)];
    g[r][c] = Math.random() < 0.9 ? 2 : 4;
    return [r, c];
}

// slide one row on left, pairs, new row + point earn
function slideRow(row){
    const a = row.filter(Boolean);
    const out = [];
    let pts = 0;
    for(let i = 0; i < a.length; i++){
        if(a[i] === a[i + 1]){
            out.push(a[i] * 2);
            pts += a[i] * 2
            i++;
        } else {
            out.push(a[i]);
        }
    }
    while (out.length < 4) out.push(0);
    return { out, pts };
}

// helper - turn the col into rows so to reuse slideRow
const tp = m => m[0].map((_, c) => m.map(r => r[c]));

function applyDir(g, dir){
    let pts = 0;
    const rows = m => m.map(row => {
        const { out, pts: p } = slideRow(row);
        pts += p;
        return out;
    });

    let b = g.map(r => [...r]);

    if(dir === 'left') b = rows(b);
    if(dir === 'right') b = rows(b.map(r => [...r].reverse())).map(r => r.reverse());
    if(dir === 'up') b = tp(rows(tp(b)));
    if(dir === 'down') b = tp(rows(tp(b).map(r => [...r].reverse())).map(r => r.reverse()));

    return {b, pts};
}

function isStuck(g){
    if(g.some(r => r.some(v => !v))) return false;
    for (let r = 0; r < 4; r++){
        for (let c = 0; c < 4; c++){
            if(c < 3 && g[r][c] === g[r][c + 1]) return false;
            if(r < 3 && g[r][c] === g[r + 1][c]) return false;
        }
    }
    return true;
}

const CELL = Math.floor(Math.min(80, (window.innerWidth - 82) / 4));
const GAP = 10;

document.documentElement.style.setProperty('--cell', CELL + 'px');
document.documentElement.style.setProperty('--gap', GAP + 'px');

const cellsEl = document.getElementById('cells');
const tilesEl = document.getElementById('tiles');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overEl = document.getElementById('gameover');

// 16 empty bg cells at once
for (let i = 0; i < 16; i++){
    const d = document.createElement('div');
    d.className = 'cell';
    cellsEl.appendChild(d);
}

function render(spawnPos){
    tilesEl.innerHTML = '';
    for (let r = 0; r < 4; r++){
        for(let c = 0; c < 4; c++){
            const v = grid[r][c];
            if(!v) continue;

            const el = document.createElement('div');
            el.className = 'tile';
            if(spawnPos && spawnPos[0] === r && spawnPos[1] === c){
                el.classList.add('new');
            }

            el.style.cssText = [
                `left:${c * (CELL + GAP)}px`,
                `top:${r * (CELL + GAP)}px`,
                `width:${CELL}px`,
                `height:${CELL}px`,
                `background:${bgFor(v)}`,
                `color:${fgFor(v)}`,
                `font-size:${fsFor(v, CELL)}px`,
            ].join(';');

            el.textContent = v;
            tilesEl.appendChild(el)
        }
    }
    scoreEl.textContent = score;
    bestEl.textContent = best;
}