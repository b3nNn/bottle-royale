class MiddlewareDeclaration {
    public provider: any;
    public constructorParams: any;

    constructor(provider: any, constructorParams?: any) {
        this.provider = provider;
        this.constructorParams = constructorParams;
    }
}

export default MiddlewareDeclaration;