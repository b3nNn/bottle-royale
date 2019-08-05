class MiddlewareDeclaration {
    public provider: Function;
    public constructorParams: any;

    constructor(provider: Function, constructorParams?: any) {
        this.provider = provider;
        this.constructorParams = constructorParams;
    }
}

export default MiddlewareDeclaration;