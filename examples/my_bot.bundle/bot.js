const location = require('location');
const client = require('client');
const player = require('player');
const game = require('game-events');
const aliveStrategy = require('./alive-strategy.js');

client.connect("SNK b3n");
client.log('client connected', JSON.stringify(client));
client.on('game_found', matchmaking => {
    client.log('game found', JSON.stringify(matchmaking));
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        client.log('matchmacking loading');
    });
    matchmaking.on('start', () => {
        client.log('matchmacking started', matchmaking);
        client.log('location', JSON.stringify(location));
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
