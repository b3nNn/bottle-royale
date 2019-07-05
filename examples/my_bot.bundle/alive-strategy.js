const lootStrategy = require('./loot-strategy');

module.exports = (client, player, game, location) => {
    const strategy = player.behavior.createStrategy('alive-strategy');
    
    strategy.on('act', params => {
        strategy.until(['landed'], [
            strategy.once('select-drop-location'),
            strategy.always('watch-for-enemy')
        ], next => {
            next(lootStrategy(client, player, game));
        });
        game.on('death', () => {
            client.log('death confirmed');
        });
    });
    strategy.task('select-drop-location', task => {
        // behavior.client.log('hello from select-drop-location');
    });
    strategy.task('watch-for-enemy', task => {
        // behavior.client.log('hello from watch-for-enemy');
    });
    return strategy;
};