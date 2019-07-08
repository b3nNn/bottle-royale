# 🚧🚧 (DRAFT) Bottle Royale - A Battle Royale Arena for JS Bots 🚧🚧


Implement your strategy for surviving with **javascript** and challenge opponents in a **battle royale** environnement.

# Features
- Up to **100 bots** per game scripted with **javascript**.
- **Event driven** client API and **scenario driven** for debugging.
- Game view with **three.js** (live, replay).
- Data persistence with **RethinkDB**.
- **Docker** for production deployment.

# Guides
### Create a bot

Provide your scripts which use the **JS API** inside a bundle **directory**. See `examples/my_bot.bundle` and `examples/foo_bar.bundle`.
- bot.js; entry point
- discord.js*; discord communication

*: optionnal

### Start a match
Start a match by running the start command:
```sh
npm run start -- --bot examples/my_bot.bundle --bot examples/foo_bar.bundle
```
or with a game configuration file:
```sh
npm run start -- --bot examples/my_bot.bundle --bot examples/foo_bar.bundle --config game.config.js
```

### Game Configuration

After beeing initialized, a game starts after `game_launch_delay` milliseconds delay. All players have an amount of life equal to `player_health` and the storm will move for the first time after `storm_stay_delay` milliseconds delay. Then, it moves for `storm_move_delay` milliseconds and level up at the end. Everytime the storms level up, it will stay again for `storm_stay_delay` then moves for `storm_move_delay` until the end of the game.

```javascript
export  default {
	game_launch_delay: 0, // ms duration before the game star
	player_health: 100.0, // amount of health for players
	storm_stay_delay: 60000, // ms duration before the storm move
	storm_move_delay: 30000, // ms duration before the storm stay
	storm_damage: 1.0, // damage per second while player is in the storm
	storm_damage_factor: 2.0  // damage factory per level
	storm_size: 1000  // storm size
	storm_size_factor: 0.3  // size factory per level
};
```

# JS API
### Minimalist bot

```javascript
const client = require('game-client');
const player = require('game-player');

client.connect("foo_bar");
client.on('game_found', matchmaking => {
    client.log('game found', client);
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        const strategy = player.behavior.createStrategy('empty-strategy');
    
        player.behavior.while(['alive'], strategy, () => {
            client.log('WTF i\'m dead too');
        });
    });
});
```

> More coming next...
