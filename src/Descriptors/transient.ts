import { Type } from "./serviceDescriptor";
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
    constructorFunction: Type<any>;
    dependencies: string[] = [];

    public static ofType(serviceName: string, type: Type<any>) : ServiceDescriptorBuilder {
        return new Transient(serviceName, type);
    }
}