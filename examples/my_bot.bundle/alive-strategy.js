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
    return strategy;
};