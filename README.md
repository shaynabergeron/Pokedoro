# Pokemonodoro (React + Vite + TS)

A Pomodoro timer that feels like a Tamagotchi, but it's Pokemon based.
Pick a starter each session, focus to earn XP/coins, care for it on breaks, and battle wild Pokémon for rewards.

## Features (MVP+)
- Splash → Starter Select → Focus → Summary → Break Hub
- Long break every 4 completed pomodoros (+bonus coins)
- Feed/items system + inventory
- Battle system with real HP tracking and rewards
- Shop (buy items; unlock Pikachu/Eevee)
- Strict Focus option (leaving tab fails session)... may change
- LocalStorage persistence

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to Netlify (coming soon)
- Build command: `npm run build`
- Publish directory: `dist`
- `netlify.toml` is included (SPA redirects)
