import { Type } from "./serviceDescriptor";
import ServiceDescriptorBuilder from "./serviceDescriptorBuilder";

export default class Singleton implements ServiceDescriptorBuilder {

    private constructor(serviceName: string, constructorFunction: Type<any>) {
        this.serviceName = serviceName;
        this.constructorFunction = constructorFunction;
    }
    withDependencies(dependencies: string[]): ServiceDescriptorBuilder {
        this.dependencies = dependencies;
        return this;
    }
    constructorFunction: Type<any>;
    dependencies: string[] = [];

    readonly serviceName: string;

    public static fromInstance(serviceName: string, implementation: any) : ServiceDescriptorBuilder {
        throw new Error("No facility to create singletons from instances");
    }

    public static ofType(serviceName: string, constructorFunction: Type<any>) : ServiceDescriptorBuilder {
        return new Singleton(serviceName, constructorFunction);
    }
}