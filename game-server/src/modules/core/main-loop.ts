import sleep from '../../components/sleep';
import Clock from '../../components/clock';
import { toSeconds } from '../game/time';
import Application from './application';
import GameServer from '../../services/game-server';

const framerate = toSeconds(1 / 10);

const mainLoop = async (App: Application, GameServer: GameServer): Promise<void> => {
    let now;
    let lastTick;
    const tick = new Clock();
    const time = {
        framerate,
        elapsed: 0,
        total: 0,
        perfs: {
            updateTime: 0,
            usage: 0
        }
    };

    tick.start();
    lastTick = tick.getElapsed();
    while (GameServer.isRunning()) {
        now = tick.getElapsed();
        time.elapsed = now - lastTick;
        time.total = now;
        time.perfs.usage = (time.perfs.updateTime / time.framerate) * 100;
        await App.update(time);
        time.perfs.updateTime = (tick.getElapsed() - now);
        if (time.perfs.updateTime < time.framerate) {
            await sleep((time.framerate - time.perfs.updateTime) / 1000);
        }
        lastTick = now;
    }
}

mainLoop.$inject = ['App', 'GameServer'];

export default mainLoop;
