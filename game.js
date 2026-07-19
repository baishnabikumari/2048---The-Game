const TILE_DARK = {
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

// light theme palette
const TILE_LIGHT = {
    1: '#cdc5b8',
    2: '#b8a888',
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
    const map = document.documentElement.dataset.theme === 'light'
        ? TILE_LIGHT
        : TILE_DARK;
    return map[Math.log2(v)] || '#602080';
}

function fgFor(v){
    // low tiles on light theme board need to get darker contract text.
    if(v <= 4){
        return document.documentElement.dataset.theme === 'light'
            ? '#5a4838'
            : '#807060';
    }
    return '#f0e8dc';
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
let inputMode = localStorage.getItem('2048e-mode') || 'both';

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

function updateModeBtn(){
    const btn = document.getElementById('btn-mode');
    if(!btn) return;
    btn.textContent = inputMode;
    document.querySelectorAll('.mopt').forEach(b => {
        b.classList.toggle('active', b.dataset.m === inputMode);
    });
}

// game state
let grid, score, best;

function start(){
    grid = make4x4();
    score = 0;
    best = +localStorage.getItem('2048e-best') || 0;
    addRandoms(grid);
    const spawn = addRandoms(grid);
    overEl.classList.add('hidden');
    render(spawn);
}

function move(dir){
    const overlay = document.getElementById('howto');
    if(overlay && !overlay.classList.contains('hidden')) return;
    const {b, pts} = applyDir(grid, dir);
    if(JSON.stringify(b) === JSON.stringify(grid)) return;

    grid = b;
    score += pts;
    if(score > best){
        best = score;
        localStorage.setItem('2048e-best', best);
    }
    const spawn = addRandoms(grid);
    render(spawn);

    if(isStuck(grid)) overEl.classList.remove('hidden');
}

const KEYS = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
};

document.addEventListener('keydown', e => {
    if(inputMode === 'swipe') return;
    if(!KEYS[e.key]) return;
    e.preventDefault();
    move(KEYS[e.key]);
});

//swipe
let t0 = null;

document.getElementById('board').addEventListener('touchstart', e => {
    if(inputMode === 'arr') return;
    t0 = [e.touches[0].clientX, e.touches[0].clientY];
}, { passive: true });

document.getElementById('board').addEventListener('touchmove', e => {
    e.preventDefault();
}, {passive: false});

document.getElementById('board').addEventListener('touchend', e => {
    if(inputMode === 'arr' || !t0) return;
    const dx = e.changedTouches[0].clientX - t0[0];
    const dy = e.changedTouches[0].clientY - t0[1];
    t0 = null;
    if(Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    move(Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up'));
});

let lastWheel = 0;
document.getElementById('board').addEventListener('wheel', e => {
    e.preventDefault();
    if(inputMode === 'arr') return;
    if(Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY)) < 30) return;
    const now = Date.now();
    if(now - lastWheel < 320) return;
    lastWheel = now
    if(Math.abs(e.deltaX) > Math.abs(e.deltaY)){
        move(e.deltaX > 0 ? 'left' : 'right');
    } else {
        move(e.deltaY > 0 ? 'up' : 'down');
    }
}, {passive: false});

document.getElementById('btn-new').onclick = start;
document.getElementById('btn-retry').onclick = start;

document.querySelectorAll('.mopt').forEach(b => {
    b.addEventListener('click', () => {
        inputMode = b.dataset.m;
        localStorage.setItem('2048e-mode', inputMode);
        updateModeBtn();
    });
});
updateModeBtn();

// kick off
start();