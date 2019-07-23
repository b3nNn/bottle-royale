import Application from "../../../src/modules/core/application";

describe('application', () => {
    let app;
    const argv = {};

    beforeEach(() => {
        app = new Application(argv);
    });

    it('use constructor argv', () => {
        expect(app.argv).toEqual(argv);
    });

    it('instanciate throw error when missing dependency', async () => {
        const middleware = {
            constructor: jest.fn(),
            $inject: ['myDepModule']
        };

        app.middleware('', middleware);
        expect.hasAssertions();
        expect(app.init()).rejects.toEqual(new Error('unknown service provider myDepModule'));
    });

    it('instanciate class middleware without deps', async () => {
        const middleware = {
            constructor: jest.fn()
        };

        app.middleware('', middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware.constructor).toHaveBeenCalled();
    });

    it('instanciate call middleware constructors with deps', async () => {
        const middleware = {
            constructor: jest.fn(),
            $inject: ['myDepModule', 'myOtherDepModule']
        };
        const myDepModule = {};
        const myOtherDepModule = {};
        app.services['myDepModule'] = myDepModule;
        app.services['myOtherDepModule'] = myOtherDepModule;
        app.middleware('', middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware.constructor).toHaveBeenCalledWith([myDepModule, myOtherDepModule]);
    });
})