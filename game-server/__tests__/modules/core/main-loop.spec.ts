import _ from 'lodash';
import Application from '../../../src/modules/core/application';
import GameServer from '../../../src/services/game-server';
import mainLoop from '../../../src/modules/core/main-loop';
import minimist = require('minimist');
import { toSeconds } from '../../../src/modules/game/time';
import Clock from '../../../src/components/clock';

jest.mock('../../../src/components/clock', () => {
    return jest.fn().mockImplementation(() => clockMock);
});
jest.mock('../../../src/modules/core/application', () => {
    return jest.fn().mockImplementation(() => applicationMock);
});
jest.mock('../../../src/services/game-server', () => {
    return jest.fn().mockImplementation(() => gameServerMock);
});

const clockMock = {
    start: jest.fn(),
    getElapsed: jest.fn().mockReturnValue(-1)
};
const applicationMock = {
    update: jest.fn().mockImplementation(time => _.cloneDeep(time))
};
const gameServerMock = {
    isRunning: jest.fn().mockReturnValue(false)
};

describe('main loop', () => {
    let app: Application;
    let gameServer: GameServer;

    beforeAll(() => {
        app = new Application(<minimist.ParsedArgs>{});
        gameServer = new GameServer({}, {}, {}, {});
    });

    afterEach(() => {
        applicationMock.update.mockClear();
        clockMock.start.mockClear();
        clockMock.getElapsed.mockClear();
    });

    it('should update the application', async () => {
        expect.hasAssertions();
        gameServerMock.isRunning.mockReturnValueOnce(true);
        await mainLoop(app, gameServer);
        expect(applicationMock.update).toHaveBeenCalledWith(expect.objectContaining({
            elapsed: expect.any(Number),
            framerate: expect.any(Number),
            perfs: expect.objectContaining({
                updateTime: expect.any(Number),
                usage: expect.any(Number)
            }),
            total: expect.any(Number),
        }));
    });

    it('should update time', async () => {
        const loopCount = 2;
        const framerate = toSeconds(1 / 10);
        const elapsedValues = [1000, 2000, 5000, 10000, 20000];
        const lastTick = [elapsedValues[0], elapsedValues[1]];
        const now = [elapsedValues[1], elapsedValues[3]];
        const updateTime = [0, elapsedValues[2] - now[0]];
        const usage = [(updateTime[0] / framerate) * 100, (updateTime[1] / framerate) * 100]
        let times = [];

        expect.hasAssertions();
        gameServerMock.isRunning.mockReturnValueOnce(true).mockReturnValueOnce(true);
        for (let val of elapsedValues) {
            clockMock.getElapsed.mockReturnValueOnce(val);
        }
        for (let it = 0; it < loopCount; it++) {
            times.push({
                framerate: framerate,
                elapsed: now[it] - lastTick[it],
                perfs: {
                    usage: usage[it],
                    updateTime: updateTime[it]
                },
                total: now[it]
            });
        }
        await mainLoop(app, gameServer);
        expect(applicationMock.update).toHaveNthReturnedWith(1, times[0]);
        expect(applicationMock.update).toHaveNthReturnedWith(2, times[1]);
    });
});