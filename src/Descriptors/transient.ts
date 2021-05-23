import ServiceProvider from "../serviceProvider";
import ServiceDescriptor from "./ServiceDescriptor";

export default class Transient implements ServiceDescriptor {

    private constructor(serviceName: string, private initialiser: (provider: ServiceProvider) => any) {
        this.serviceName = serviceName;
    }

    getImplementation(provider: ServiceProvider): any {
        return this.initialiser(provider);
    }

    readonly serviceName: string;

    public static fromInstance(serviceName: string, implementation: any) : Transient {
        return new Transient(serviceName, (provider: ServiceProvider) => implementation);
    }

    public static fromFactory(serviceName: string, factory: (provider: ServiceProvider) => any) : Transient {
        return new Transient(serviceName, factory);
    }
}