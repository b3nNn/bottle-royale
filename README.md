# Bottle Royale - A Battle Royale Arena for JS Bots

Implement your strategy for surviving with **javascript** and challenge opponents in a **battle royale** environnement.

# Guide

## Create a bot

Provide a **unique javascript file** with your code using the **JS API**.

## Start a match

Start a match by running the start command:
```sh
npm run start -- bot1.js bot2.js
```
or with a game configuration file:
```sh
npm run start -- bot1.js bot2.js --config game.config.js
```

## Game Configuration

After beeing initialized, a game starts after `game_launch_delay` milliseconds delay. All players have an amount of life equal to `player_health` and the storm will move for the first time after `storm_stay_delay`  milliseconds delay. Then, it moves for `storm_move_delay` milliseconds and level up at the end. Everytime the storms level up, it will stay again for `storm_stay_delay` then moves for `storm_move_delay` until the end of the game.

```javascript
export default {
	game_launch_delay: 0, // ms duration before the game star
	player_health: 100.0, // amount of health for players
	storm_stay_delay: 60000, // ms duration before the storm move
	storm_move_delay: 30000, // ms duration before the storm stay
	storm_damage: 1.0, // damage per second while player is in the storm
	storm_damage_factor: 2.0 // damage factory per level
	storm_size: 1000 // storm size
	storm_size_factor: 0.3 // size factory per level
};
```

# JS API

> Coming next...
