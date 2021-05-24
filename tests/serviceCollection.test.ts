import { Mock } from 'moq.ts';
import ServiceCollection from '../src/serviceCollection';
import ServiceDescriptor from '../src/Descriptors/serviceDescriptor';
import { CyclicDependenciesError, DuplicateServiceNameError, MissingDependenciesError } from '../src/errors';

describe("ServiceCollection", () => {
    it("Can have a descriptor registered", () => {
        const descriptor = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName)
            .returns("D1").object();

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(descriptor);

        expect(serviceCollection["descriptors"]).toContainEqual(descriptor);
    });

    it("Can have multiple descriptors registered", () => {
        const d1 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName)
            .returns("D1").object();
        const d2 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName)
            .returns("D2").object();

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(d1)
                            .register(d2);

        expect(serviceCollection["descriptors"]).toContainEqual(d1);
        expect(serviceCollection["descriptors"]).toContainEqual(d2);
    });

    it("Can build a service provider with the registered descriptors", () => {
        const d1 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName).returns("D1")
            .setup(i => i.dependencies).returns([]);
        const d2 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName).returns("D2")
            .setup(i => i.dependencies).returns([]);

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(d1.object())
                            .register(d2.object());

        const serviceProvider = serviceCollection.build();
        expect(serviceProvider.services).toContain("D1");
        expect(serviceProvider.services).toContain("D2");
    });

    it("throws an error when registered dependencies are cyclic", () => {
        const d1 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName).returns("D1")
            .setup(i => i.dependencies).returns(["D2"]);
        const d2 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName).returns("D2")
            .setup(i => i.dependencies).returns(["D1"]);

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(d1.object())
                            .register(d2.object());

        expect(() => serviceCollection.build()).toThrow(CyclicDependenciesError);
    });

    it("throws an error when two services are attempted to be registered with the same name", () => {
        const d1 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName)
            .returns("D1").object();
        const d2 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName)
            .returns("D1").object();

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(d1);

        expect(() => serviceCollection.register(d2)).toThrow(DuplicateServiceNameError);
    });

    it("throws an error when a service is missing a dependency", () => {
        const d1 = new Mock<ServiceDescriptor>()
            .setup(i => i.serviceName).returns("D1")
            .setup(i => i.dependencies).returns(["D2"]);

        const serviceCollection = new ServiceCollection();
        serviceCollection.register(d1.object());

        expect(() => serviceCollection.build()).toThrow(MissingDependenciesError);     
    })
});