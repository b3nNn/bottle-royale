class ServiceDeclaration {
    public name: string;
    public provider: any;
    public constructorParams: any;

    constructor(name: string, provider: any, constructorParams?: any) {
        this.name = name;
        this.provider = provider;
        this.constructorParams = constructorParams;
    }
}

export default ServiceDeclaration;