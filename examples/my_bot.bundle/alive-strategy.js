const lootStrategy = require('./loot-strategy');

module.exports = behavior => {
    const strategy = behavior.createStrategy('alive-strategy');
    
    strategy.on('act', params => {
        strategy.until(['landed'], [
            strategy.once('select-drop-location'),
            strategy.always('watch-for-enemy')
        ], next => {
            next(lootStrategy(behavior));
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