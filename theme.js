const saved = localStorage.getItem('2048e-theme');
const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme = saved || (sysDark ? 'dark' : 'light');

//applies theme to html and update the toggle icon
function applyTheme(t){
    theme = t;
    document.documentElement.dataset.theme = t;
    localStorage.setItem('2048e-theme', t);
    const btn = document.getElementById('btn-theme');
    //icon shows what to switch to
    btn.textContent = t === 'dark' ? '☀' : '☾';
    if(typeof render === 'function') render(null);
}

applyTheme(theme);
document.getElementById('btn-theme').addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
})