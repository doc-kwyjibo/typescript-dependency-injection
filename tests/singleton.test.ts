import { Bar, Foo } from "./helperClasses";
import Singleton from '../src/Descriptors/singleton';
import ServiceProvider from "../src/serviceProvider";
import { Mock } from 'moq.ts';

const mockServiceProvider = new Mock<ServiceProvider>().object();

describe("Singleton", () => {
    test("Construction using fromInstance stores service name and implementation", () => {
        const serviceName = "MyService";
        const implementation = new Foo();

        const descriptor = Singleton.fromInstance(serviceName, implementation);

        expect(descriptor.serviceName).toEqual(serviceName);
        expect(descriptor.getImplementation(mockServiceProvider)).toBe(implementation);
    });

    test("Construction using fromFactory stores service name and implementation", () => {
        const serviceName = "MyService";
        const factory = (provider: ServiceProvider) => new Bar(new Foo());

        const descriptor = Singleton.fromFactory(serviceName, factory);

        expect(descriptor.serviceName).toEqual(serviceName);
        const instance = descriptor.getImplementation(mockServiceProvider);
        expect(instance instanceof Bar).toBeTruthy();
    });

    test("Only the same instance of the factory is returned on multiple calls", () => {
        const serviceName = "MyService";
        const factory = (provider: ServiceProvider) => new Bar(new Foo());

        const descriptor = Singleton.fromFactory(serviceName, factory);

        const instance1 = descriptor.getImplementation(mockServiceProvider);
        const instance2 = descriptor.getImplementation(mockServiceProvider);
        expect(Object.is(instance1, instance2)).toBeTruthy();
    });
});