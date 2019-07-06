const location = require('location');
const client = require('game-client');
const player = require('game-player');
const game = require('game-engine');
const aliveStrategy = require('./alive-strategy.js');

client.connect("SNK b3n");
client.on('game_found', matchmaking => {
    client.log('game found', client);
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        client.log('matchmacking loading', matchmaking.serialize());
    });
    matchmaking.on('start', () => {
        client.log('matchmacking started', matchmaking.serialize());
        client.log('location', location);
        client.log('let\'s have some fun');
        game.on('landed', () => {
            client.log('landed confirmed');
        });
        game.on('became_active', () => {
            client.log('became_active confirmed');
        });
        player.behavior.while(['alive'], aliveStrategy(client, player, game, location), () => {
            client.log('Oups i\'m dead Oo');
        });
    });
});
