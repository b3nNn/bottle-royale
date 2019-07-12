// const location = require('location');

console.log('location test', br.Client);
// const Client = require('client');
// const player = require('player');
// const GameEvents = require('game-events');
// const aliveStrategy = require('./alive-strategy.js');
// const StormEvents = require('storm-events');

// console.log('TEST 42 4242');
// console.log('test 42', require('client'));
const location = new br.PlayerLocation();
const client = new br.Client();
const storm = new br.StormEvents();
const game = new br.GameEvents();
const player = new br.Player();
client.connect("SNK b3n");
client.log('client connected', JSON.stringify(client));
client.on('game_found', matchmaking => {
    client.log('game found', JSON.stringify(matchmaking));
    matchmaking.accept(client);
    matchmaking.on('load', () => {
        client.log('matchmacking loading');
    });
    matchmaking.on('start', () => {
        client.log('matchmacking loading', JSON.stringify(matchmaking));
        storm.on('prepare', storm => {
            client.log('the storm prepare', JSON.stringify(storm));
        });
        storm.on('stay', storm => {
            client.log('the storm stay', JSON.stringify(storm));
        });
        storm.on('move', storm => {
            client.log('the storm move', JSON.stringify(storm));
        });
        player._ID = 42;
        client.log(`matchmacking started`, JSON.stringify(player));
        client.log('location', JSON.stringify(location));
        client.log('let\'s have some fun', player.vehicule);
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
