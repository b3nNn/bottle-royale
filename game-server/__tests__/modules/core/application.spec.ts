import minimist from 'minimist';
import Application from "../../../src/modules/core/application";
import ApplicationConfig from '../../../src/modules/core/application-config';
import IMiddleware from '../../../src/modules/core/imiddleware';
import { Time } from '../../../src/modules/game/time';
import IService from '../../../src/modules/core/iservice';

jest.mock('../../../src/modules/core/application-config');

let $inject: string[] = [];
const middleware = jest.fn();
const service = jest.fn();
const configure = jest.fn();

class Middleware implements IMiddleware {
    static $inject = $inject;
    constructor(...args: any) {
        middleware(...args);
    }

    run() {}

    update() {}
}

class Service implements IService {
    static $inject = $inject;
    constructor(...args: any) {
        service(...args);
    }

    configure() {
        configure();
    }
}

describe('application', () => {
    let app: Application;
    const argv = minimist([]);

    beforeEach(() => {
        app = new Application(argv);
    });

    afterEach(() => {
        $inject.splice(0, $inject.length);
        middleware.mockClear();
        service.mockClear();
        configure.mockClear();
    });

    it('should use constructor argv', () => {
        expect(app.argv).toEqual(argv);
        expect(ApplicationConfig).toHaveBeenCalledWith(app.argv);
    });

    it('should throw error when missing middleware dependency', async () => {
        $inject.push('myDepModule');
        app.middleware(Middleware);
        expect.hasAssertions();
        try {
            await app.init();
        } catch (err) {
            expect(err).toEqual(new Error('unknown service provider myDepModule from Middleware, got []'));
        }
    });

    it('should throw error when missing service dependency', async () => {
        $inject.push('myDepModule');
        app.service('myService', Service);
        expect.hasAssertions();
        try {
            await app.init();
        } catch (err) {
            expect(err).toEqual(new Error('unknown service provider myDepModule from Service, got []'));
        }
    });

    it('should instanciate class middleware without deps', async () => {
        app.middleware(Middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware).toHaveBeenCalledWith();
    });

    it('should instanciate class service without deps', async () => {
        app.service('myService', Service);
        await app.init();
        expect.hasAssertions();
        expect(service).toHaveBeenCalledWith();
    });

    it('should call middleware constructor with deps', async () => {
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

    it('should call service constructor with deps', async () => {
        const myDepModule = {};
        const myOtherDepModule = {};
        app.services.set('myDepModule', myDepModule);
        app.services.set('myOtherDepModule', myOtherDepModule);
        $inject.push('myDepModule', 'myOtherDepModule');
        app.service('myService', Service);
        await app.init();
        expect.hasAssertions();
        expect(service).toHaveBeenCalledWith(myDepModule, myOtherDepModule);
    });

    it('should inject Application as middleware dependency', async () => {
        $inject.push('App');
        app.middleware(Middleware);
        await app.init();
        expect.hasAssertions();
        expect(middleware).toHaveBeenCalledWith(app);
    });

    it('should inject Application as service dependency', async () => {
        $inject.push('App');
        app.service('myService', Service);
        await app.init();
        expect.hasAssertions();
        expect(service).toHaveBeenCalledWith(app);
    });

    it('should inject middleware\'s constructor parameters', async () => {
        const params: any = {};
        
        $inject.push('App');
        app.middleware(Middleware, params);
        await app.init();
        expect.hasAssertions();
        expect(middleware).toHaveBeenCalledWith(params, app);
    });

    it('should inject service\'s constructor parameters', async () => {
        const params: any = {};
        
        $inject.push('App');
        app.service('myService', Service, params);
        await app.init();
        expect.hasAssertions();
        expect(service).toHaveBeenCalledWith(params, app);
    });

    it('should initialise when running', async () => {
        const spy = jest.spyOn(app, 'init');

        await app.run(() => {});
        expect.hasAssertions();
        expect(spy).toHaveBeenCalledWith();
    });

    it('should configure any service', async () => {
        app.service('myService', Service);
        await app.init();
        expect.hasAssertions();
        expect(configure).toHaveBeenCalledWith();
    });

    it('should run middlewares', async () => {
        const middleware = new Middleware();
        const spy = jest.spyOn(middleware, 'run');

        app.middlewares.push(middleware);
        app.middleware(Middleware);
        await app.run(() => {});
        expect.hasAssertions();
        expect(spy).toHaveBeenCalledWith();
    });

    it('should update middlewares', async () => {
        const middleware = new Middleware();
        const spy = jest.spyOn(middleware, 'update');
        const time = new Time();

        app.middlewares.push(middleware);
        app.middleware(Middleware);
        await app.update(time);
        expect.hasAssertions();
        expect(spy).toHaveBeenCalledWith(time);
    });
})