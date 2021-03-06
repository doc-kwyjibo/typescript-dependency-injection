import { Bar, Foo } from "./helperClasses";
import Transient from '../src/Descriptors/transient';
import { ServiceLifetime } from "../src/Descriptors/serviceDescriptor";

describe("Transient", () => {
    test("Construction using fromFactory stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Transient.ofType(serviceName, Bar);

        expect(descriptor.serviceName).toEqual(serviceName);
        expect(descriptor.constructorFunction).not.toBeNull();
        // @ts-ignore TS2531 ignored as we want the runtime error
        const instance = new descriptor.constructorFunction();
        expect(instance instanceof Bar).toBeTruthy();
    });
 
    test("Lifetime is transient", () => {
        const descriptor = Transient.ofType("MyService", Foo);

        expect(descriptor.lifetime).toEqual(ServiceLifetime.Transient);
    })

    test("Able to store dependency list", () => {
        const serviceName = "MyService";

        const descriptor = Transient.ofType(serviceName, Foo).withDependencies(["A"]);

        expect(descriptor.dependencies).toEqual(["A"]);
    });
});