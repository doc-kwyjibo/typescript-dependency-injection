import ServiceProvider from "../serviceProvider";

export default interface ServiceDescriptor {
    readonly serviceName: string;

    getImplementation(provider: ServiceProvider): any;
}