import { It, Mock } from 'moq.ts';
import { Bar, BarBaz, Baz, Foo } from "./helperClasses";
import ServiceDescriptor, { ServiceLifetime } from '../src/Descriptors/serviceDescriptor';
import ServiceProvider from '../src/serviceProvider';
import { MissingServiceError } from '../src/errors';

describe("ServiceProvider", () => {
    it("creates instance with no dependencies", () => {
        const descriptors = [
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("D1")
                .setup(i => i.constructorFunction).returns(Foo)
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object()
        ];

        const provider = new ServiceProvider(descriptors);

        const instance = provider.resolve<Foo>("D1");
        expect(instance instanceof Foo).toBeTruthy();
    });

    it("throws MissingServiceError for unknown service name", () => {

        const provider = new ServiceProvider([]);

        expect(() => {
            provider.resolve<Foo>("D1")
        }).toThrow(MissingServiceError);
    });

    it("can construct an instance with dependencies", () => {
        const descriptors = [
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("Foo")
                .setup(i => i.constructorFunction).returns(Foo)
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object(),
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("Bar")
                .setup(i => i.constructorFunction).returns(Bar)
                .setup(i => i.dependencies).returns(["Foo"])
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object(),
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("Baz")
                .setup(i => i.constructorFunction).returns(Baz)
                .setup(i => i.dependencies).returns(["Foo"])
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object(),
                new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("BarBaz")
                .setup(i => i.constructorFunction).returns(BarBaz)
                .setup(i => i.dependencies).returns(["Bar", "Baz"])
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object()
        ];

        const provider = new ServiceProvider(descriptors);

        const instance = provider.resolve<BarBaz>("BarBaz");
        
        expect(instance instanceof BarBaz).toBeTruthy();
        expect(() => instance.barbaz()).not.toThrowError();
    });

    it("retrieves the same instance for singletons", () => {
        const descriptors = [
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("D1")
                .setup(i => i.constructorFunction).returns(Foo)
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object()
        ];

        const provider = new ServiceProvider(descriptors);

        const d1 = provider.resolve<Foo>("D1");
        const d2 = provider.resolve<Foo>("D1");

        expect(d2).toEqual(d1);
    });

    it("retrieves the same instance for singletons", () => {
        const descriptors = [
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("D1")
                .setup(i => i.constructorFunction).returns(Foo)
                .setup(i => i.lifetime).returns(ServiceLifetime.Singleton)
                .object()
        ];

        const provider = new ServiceProvider(descriptors);

        const d1 = provider.resolve<Foo>("D1");
        const d2 = provider.resolve<Foo>("D1");

        expect(d2).toBe(d1);
    });

    it("retrieves the different instances for transients", () => {
        const descriptors = [
            new Mock<ServiceDescriptor>()
                .setup(i => i.serviceName).returns("D1")
                .setup(i => i.constructorFunction).returns(Foo)
                .setup(i => i.lifetime).returns(ServiceLifetime.Transient)
                .object()
        ];

        const provider = new ServiceProvider(descriptors);

        const d1 = provider.resolve<Foo>("D1");
        const d2 = provider.resolve<Foo>("D1");

        expect(d2).not.toBe(d1);
    });
});