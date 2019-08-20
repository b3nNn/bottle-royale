import ServiceDeclaration from '../../../src/modules/core/service-declaration';

describe('service declaration', () => {
    it('should reflect constructor parameters', () => {
        const name = 'my service';
        const provider = 'my provider';
        const constructorParams = 'my constructor params';
        const sd = new ServiceDeclaration(name, provider, constructorParams);

        expect.hasAssertions();
        expect(sd.name).toEqual(name);
        expect(sd.provider).toEqual(provider);
        expect(sd.constructorParams).toEqual(constructorParams);
    });
});