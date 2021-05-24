import { Bar, Foo } from "./helperClasses";
import Singleton from '../src/Descriptors/singleton';
import { ServiceLifetime } from "../src/Descriptors/serviceDescriptor";

describe("Singleton", () => {
    test("Construction using ofType stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.ofType(serviceName, Bar);

        expect(descriptor.serviceName).toEqual(serviceName);
        const instance = new descriptor.constructorFunction();
        expect(instance instanceof Bar).toBeTruthy();
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