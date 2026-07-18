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