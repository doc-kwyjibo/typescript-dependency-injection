import { Bar } from "./helperClasses";
import Singleton from '../src/Descriptors/singleton';

describe("Singleton", () => {
    test("Construction using ofType stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.ofType(serviceName, Bar);

        expect(descriptor.serviceName).toEqual(serviceName);
        const instance = new descriptor.constructorFunction();
        expect(instance instanceof Bar).toBeTruthy();
    });

    test("Able to store dependency list", () => {
        const serviceName = "MyService";

        const descriptor = Singleton.ofType(serviceName, Bar).withDependencies(["A", "B", "C"]);

        expect(descriptor.dependencies).toEqual(["A", "B", "C"]);
    });
});