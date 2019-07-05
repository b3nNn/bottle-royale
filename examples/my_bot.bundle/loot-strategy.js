const surviveStrategy = require('./survive-strategy');

module.exports = (client, player, game) => {
    const strategy = player.behavior.createStrategy('loot-strategy');
    
    strategy.on('act', params => {
        client.log('now looking for a weapon :3');
        strategy.until(['has_weapon'], [
            strategy.always('watch-for-stuff')
        ], next => {
            next(surviveStrategy(client, player, game));
        });
    });
    strategy.task('watch-for-stuff', task => {
        // behavior.client.log('hello from watch-for-stuff');
    });
    return strategy;
};