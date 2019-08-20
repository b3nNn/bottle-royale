import MiddlewareDeclaration from '../../../src/modules/core/middleware-declaration';

describe('middleware declaration', () => {
    it('should reflect constructor parameters', () => {
        const provider = 'my provider';
        const constructorParams = 'my constructor params';
        const md = new MiddlewareDeclaration(provider, constructorParams);

        expect.hasAssertions();
        expect(md.provider).toEqual(provider);
        expect(md.constructorParams).toEqual(constructorParams);
    });
});