import ServiceDescriptor from "./Descriptors/serviceDescriptor";

export default class ServiceProvider {

    private descriptorMap: Map<string, ServiceDescriptor>;

    constructor(serviceDescriptors: ServiceDescriptor[]) {
        this.descriptorMap = new Map<string, ServiceDescriptor>(serviceDescriptors.map(s => [s.serviceName, s]));
        this.services = serviceDescriptors.map(s => s.serviceName);
    }

    readonly services: string[];

    resolve<T>(serviceName: string) : T {
        throw new Error("Method not implemented");
    }
}