import { Factory, ServiceLifetime, Type } from "./serviceDescriptor";
import ServiceDescriptorBuilder from "./serviceDescriptorBuilder";

export default class Singleton implements ServiceDescriptorBuilder {

    private constructor(serviceName: string, callbackType: CallbackType, callback: Type<any> | Factory<any>) {
        this.serviceName = serviceName;
        if (callbackType === CallbackType.Constructor) {
            this.constructorFunction = callback as Type<any>;
        } else {
            this.factoryFunction = callback as Factory<any>;
        }
    }
    withDependencies(dependencies: string[]): ServiceDescriptorBuilder {
        this.dependencies = dependencies;
        return this;
    }
    constructorFunction: Type<any> | null = null;
    factoryFunction: Factory<any> | null = null;
    dependencies: string[] = [];

    readonly serviceName: string;
    readonly lifetime: ServiceLifetime = ServiceLifetime.Singleton;

    public static fromInstance(serviceName: string, implementation: any) : ServiceDescriptorBuilder {
        return new Singleton(serviceName, CallbackType.Factory , (p) => implementation);
    }

    public static fromFactory(serviceName: string, factory: Factory<any>) : ServiceDescriptorBuilder {
        return new Singleton(serviceName, CallbackType.Factory, factory);
    }

    public static ofType(serviceName: string, constructorFunction: Type<any>) : ServiceDescriptorBuilder {
        return new Singleton(serviceName, CallbackType.Constructor, constructorFunction);
    }
}

enum CallbackType {
    Constructor,
    Factory
}