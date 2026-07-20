# 2048 Endless
There is no win condition. Completed 2048?...keep going. hit 4096...keep going - boards keep generating tiles till you run out of the moves that when your game is over.

---

# ScreenShots (video demo)

<img width="1440" height="773" alt="Screenshot 2026-07-20 at 2 05 20 PM" src="https://github.com/user-attachments/assets/bdc6a84d-32fc-46c7-a3c7-cbe92f7af572" />

<img width="1440" height="775" alt="Screenshot 2026-07-20 at 2 05 13 PM" src="https://github.com/user-attachments/assets/a5630b65-8f56-4473-911d-a7cb5bb9b879" />

<img width="1440" height="775" alt="Screenshot 2026-07-20 at 2 06 15 PM" src="https://github.com/user-attachments/assets/1a0c38d6-44c9-4280-b78a-fbd3f04cb365" />

<img width="1440" height="775" alt="Screenshot 2026-07-20 at 2 06 35 PM" src="https://github.com/user-attachments/assets/6ac95ea1-01c7-432b-a3a0-a379d0ab91d7" />

# Demo Video

https://github.com/user-attachments/assets/f004fb11-10f0-48ca-86a7-1203dd572dcf

---

# theme - Endless
the whole game revolves around the endless mechanic:-
- no 2048 win screen. no "you won" popup... no game-ending success state.
- tile colors keep evolving past 2048 - 4096. you can see the color pallete in the game.js(eg- magenta, deep blue, emerald and crimson etc...) and anything beyond falls back to the violet.
- the tile palette itself tells you the story - like gray lead at 2, copper and bronze in the middle, gold at 512-2048 hurry up goo and see by yourself.
- game only end when the board is truly stuck - no empty cells are left to play is the GAME OVER.
- score will be saved via localstorage so your endless really is endless...

---

# Features
- fully responsive - cell size scales down for mobile...
- dark and light theme (toggle at the top-right corner).
- input mode switcher(top-right corner) - use that to switch on arrow keys, swipe only or both.
- Touchpad(laptop, mac) - more responsive is the arrow keys.
- best score card and score card.
- best score is stored via localstorage.
- system color theme on the first load.

---

# File structure.

<img width="188" height="170" alt="Screenshot 2026-07-20 at 2 10 52 PM" src="https://github.com/user-attachments/assets/c9167ed4-703c-4355-b6f5-fd5834965218" />

## Run it locally
```bash
git clone (repo link)

cd (folder)

Opent the .html file with live server.
            OR
python3 -m http.server 8000

And then visit the `http://localhost:8000`
```

---

## How it work tho.
**game logic (`game.js`)**
- grid is a 4x4 array of numbers, 0 means empty.
- `slideRow()` - handles one row sliding left.
- `applyDir()` - reuses `slideRow` for all for direction slides.
- transpose helper `tp` swaps the r and c so c moves can reuse the row logic.
- `inStuck()` returns the true only when zero empty cells exist AND no equal tiles remain in there.

---

## Why endlesss...
Most of the 2048 games made by the people end when you reach 2048 but this is endless... thats the whole shape od the game.

---
Made with 💖 By Bishuu.. for alchemize S1.
