import { Factory, ServiceLifetime, Type } from "./serviceDescriptor";
import ServiceDescriptorBuilder from "./serviceDescriptorBuilder";

export default class Transient implements ServiceDescriptorBuilder {

    private constructor(serviceName: string, constructorFunction: Type<any>) {
        this.serviceName = serviceName;
        this.constructorFunction = constructorFunction;
    }

    withDependencies(dependencies: string[]): ServiceDescriptorBuilder {
        this.dependencies = dependencies;
        return this;
    }
    serviceName: string;
    constructorFunction: Type<any> | null = null;
    factoryFunction: Factory<any> | null = null;
    dependencies: string[] = [];
    readonly lifetime: ServiceLifetime = ServiceLifetime.Transient;

    public static ofType(serviceName: string, type: Type<any>) : ServiceDescriptorBuilder {
        return new Transient(serviceName, type);
    }
}