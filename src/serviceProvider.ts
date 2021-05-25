import ServiceDescriptor, { ServiceLifetime } from "./Descriptors/serviceDescriptor";
import { MissingServiceError } from "./errors";

export default class ServiceProvider {

    private descriptorMap: Map<string, ServiceDescriptor>;

    constructor(serviceDescriptors: ServiceDescriptor[]) {
        this.descriptorMap = new Map<string, ServiceDescriptor>(serviceDescriptors.map(s => [s.serviceName, s]));
        this.services = serviceDescriptors.map(s => s.serviceName);
    }

    readonly services: string[];

    private constructedSingletons: Map<string, any> = new Map<string, any>();

    resolve<T>(serviceName: string) : T {

        // see if we don't need to do anything as we are trying 
        // to get an already constructed singleton
        if (this.constructedSingletons.has(serviceName)) {
            return this.constructedSingletons.get(serviceName) as T;
        }

        const descriptor = this.descriptorMap.get(serviceName);

        if (!descriptor) {
            throw new MissingServiceError(serviceName);
        }

        const dependencies = descriptor.dependencies ?? [];

        const args = dependencies.map(d => this.resolve<object>(d));

        let instance = null;
        if (descriptor.constructorFunction != null) {
            instance = new descriptor.constructorFunction(...args);
        }
        else if (descriptor.factoryFunction != null) {
            instance = descriptor.factoryFunction(this);
        }
        
        if (descriptor.lifetime === ServiceLifetime.Singleton) {
            this.constructedSingletons.set(serviceName, instance);
        }
        
        return instance as T;
        
    }
}