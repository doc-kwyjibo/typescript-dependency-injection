import ServiceDescriptor from "./serviceDescriptor";

export default interface ServiceDescriptorBuilder extends ServiceDescriptor {
    withDependencies(dependencies: string[]) : ServiceDescriptorBuilder;
}