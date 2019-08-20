import GameServer from '../../../src/services/game-server';

jest.mock('nanoid');
const nanoid = require('nanoid');
const nextID: string = 'my next ID';
nanoid.mockImplementation(() => nextID);

describe('game server service', () => {
    const collections = {};
    const clientService = {
        handleMatchmaking: jest.fn(),
        bootstrapMatchmaking: jest.fn()
    };
    const matchmaking = {
        createInstance: jest.fn(),
        open: jest.fn(),
        start: jest.fn(),
        live: jest.fn(),
        end: jest.fn()
    };
    const gameEngine = {
        start: jest.fn(),
        events: {
            fire: jest.fn()
        }
    };
    let gs;

    beforeEach(() => {
        gs = new GameServer(collections, clientService, matchmaking, gameEngine);
    });

    afterEach(() => {
        nanoid.mockClear();
        clientService.handleMatchmaking.mockClear();
        clientService.bootstrapMatchmaking.mockClear();
        matchmaking.createInstance.mockClear();
        matchmaking.open.mockClear();
        matchmaking.start.mockClear();
        matchmaking.live.mockClear();
        matchmaking.end.mockClear();
        gameEngine.start.mockClear();
        gameEngine.events.fire.mockClear();
    });

    it('should reflect constructor parameters', () => {
        expect.hasAssertions();
        expect(gs.collections).toEqual(collections);
        expect(gs.clients).toEqual(clientService);
        expect(gs.matchmaking).toEqual(matchmaking);
        expect(gs.engine).toEqual(gameEngine);
    });

    it('should have some default values', () => {
        expect.hasAssertions();
        expect(GameServer.$inject).toEqual(['Collections', 'ClientService', 'Matchmaking', 'GameEngine']);
        expect(gs.ID).toEqual(nextID);
        expect(gs.run).toBeTruthy();
    });

    it('should initialize a new matchmaking instance', async () => {
        const matchmakingInstance = {};

        expect.hasAssertions();
        matchmaking.createInstance.mockReturnValueOnce(matchmakingInstance);
        const returnValue = await gs.startMatchmaking();
        expect(matchmaking.open).toHaveBeenCalledWith(matchmakingInstance);
        expect(clientService.handleMatchmaking).toHaveBeenCalledWith(matchmakingInstance);
        expect(matchmaking.start).toHaveBeenCalledWith(matchmakingInstance);
        expect(clientService.bootstrapMatchmaking).toHaveBeenCalledWith(matchmakingInstance);
        expect(matchmaking.live).toHaveBeenCalledWith(matchmakingInstance);
        expect(gameEngine.start).toHaveBeenCalledWith(matchmakingInstance);
        expect(returnValue).toEqual(matchmakingInstance);
    });

    it('should terminate all matchmakings', async () => {
        expect.hasAssertions();
        await gs.endMatchmaking();
        expect(matchmaking.end).toHaveBeenCalledWith();
        expect(gameEngine.events.fire).toHaveBeenCalledWith('matchmaking_end');
    });
})
