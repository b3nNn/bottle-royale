import Application from "../../../src/modules/core/application";
import minimist from 'minimist';

describe('application', () => {
    let app: Application;
    const argv = minimist([]);
    const middleware = jest.fn();
    let $inject: string[] = [];
    class Middleware {
        static $inject = $inject;
        constructor(...args: any) {
            middleware(...args);
        }
    }

    beforeEach(() => {
        app = new Application(argv);
    });

    afterEach(() => {
        $inject.splice(0, $inject.length);
        middleware.mockClear();
    });

    it('should use constructor argv', () => {
        expect(app.argv).toEqual(argv);
    });

    it('should throw error when missing dependency', async () => {
        $inject.push('myDepModule');
        app.middleware(Middleware);
        expect.hasAssertions();
        try {
            await app.init();
        } catch (err) {
            expect(err).toEqual(new Error('unknown service provider myDepModule from Middleware, got []'));
        }
    });

    it('should instanciate class middleware without deps', async () => {
        app.middleware(Middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware).toHaveBeenCalledWith();
    });

    it('should call middleware constructors with deps', async () => {
        const myDepModule = {};
        const myOtherDepModule = {};
        app.services.set('myDepModule', myDepModule);
        app.services.set('myOtherDepModule', myOtherDepModule);
        $inject.push('myDepModule', 'myOtherDepModule');
        app.middleware(Middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware).toHaveBeenCalledWith(myDepModule, myOtherDepModule);
    });
})