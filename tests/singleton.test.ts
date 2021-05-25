import { Mock } from 'moq.ts';
import { Bar, Foo } from "./helperClasses";
import Singleton from '../src/Descriptors/singleton';
import { ServiceLifetime } from "../src/Descriptors/serviceDescriptor";
import ServiceProvider from "../src/serviceProvider";

describe("Singleton", () => {
    test("Construction using ofType stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.ofType(serviceName, Bar);

        expect(descriptor.serviceName).toEqual(serviceName);
        
        expect(descriptor.constructorFunction).not.toBeNull();
        // @ts-ignore TS2531 ignored as we want the runtime error
        const instance = new descriptor.constructorFunction();
        expect(instance instanceof Bar).toBeTruthy();
    });

    test("Construction with fromInstance returns the same implementation", () => {
        const instance = {a: 1, b: "three"};

        const descriptor = Singleton.fromInstance("MyService", instance);
        expect(descriptor.serviceName).toEqual("MyService");
        
        expect(descriptor.factoryFunction).not.toBeNull();
        // @ts-ignore TS2531, TS2721 ignored as we want the runtime error
        const buildInstance = descriptor.factoryFunction(new Mock<ServiceProvider>().object());
        expect(buildInstance).toBe(instance);
    });

    test("Construction using fromFactory stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.fromFactory(serviceName, (p) => new Foo());

        expect(descriptor.serviceName).toEqual(serviceName);
        expect(descriptor.factoryFunction).not.toBeNull();
        // @ts-ignore TS2531, TS2721 ignored as we want the runtime error
        const instance = descriptor.factoryFunction(new Mock<ServiceProvider>().object());
        expect(instance instanceof Foo).toBeTruthy();
    });

    test("Lifetime is singleton", () => {
        const descriptor = Singleton.ofType("MyService", Foo);

        expect(descriptor.lifetime).toEqual(ServiceLifetime.Singleton);
    })

    test("Able to store dependency list", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.ofType(serviceName, Bar).withDependencies(["A", "B", "C"]);

        expect(descriptor.dependencies).toEqual(["A", "B", "C"]);
    });
});