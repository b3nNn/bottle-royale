class ServiceDeclaration {
    public name: string;
    public provider: Function;
    public constructorParams: any;

    constructor(name: string, provider: Function, constructorParams?: any) {
        this.name = name;
        this.provider = provider;
        this.constructorParams = constructorParams;
    }
}

export default ServiceDeclaration;