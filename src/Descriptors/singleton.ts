import ServiceProvider from "../serviceProvider";
import ServiceDescriptor from "./ServiceDescriptor";

export default class Singleton implements ServiceDescriptor {

    private constructor(serviceName: string, private initialiser: (provider: ServiceProvider) => any) {
        this.serviceName = serviceName;
        this.implementation = null;
    }

    private implementation: any | null;
    getImplementation(provider: ServiceProvider): any {
        if (this.implementation == null) {
            this.implementation = this.initialiser(provider);
        }
        
        return this.implementation;
    }

    readonly serviceName: string;

    public static fromInstance(serviceName: string, implementation: any) : Singleton {
        return new Singleton(serviceName, (provider: ServiceProvider) => implementation);
    }

    public static fromFactory(serviceName: string, factory: (provider: ServiceProvider) => any) : Singleton {
        return new Singleton(serviceName, factory);
    }
}