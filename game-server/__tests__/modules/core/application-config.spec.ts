import minimist from 'minimist';
import ApplicationConfig from '../../../src/modules/core/application-config';

describe('application config', () => {
    it('should parse host argument', () => {
        let config;

        config = new ApplicationConfig(minimist([]));
        expect(config.host).toBeUndefined();
        config = new ApplicationConfig(minimist(['--host', '42']));
        expect(config.host).toBeUndefined();
        config = new ApplicationConfig(minimist(['--host=localhost']));
        expect(config.host).toEqual('localhost');
    });

    it('should parse debug argument', () => {
        let config;

        config = new ApplicationConfig(minimist([]));
        expect(config.debug).toBeFalsy();
        config = new ApplicationConfig(minimist(['--debug']));
        expect(config.debug).toBeTruthy();
    });

    it('should parse debug-persistence argument', () => {
        let config;

        config = new ApplicationConfig(minimist([]));
        expect(config.debugPersistence).toBeFalsy();
        config = new ApplicationConfig(minimist(['--debug-persistence']));
        expect(config.debugPersistence).toBeTruthy();
    });
})