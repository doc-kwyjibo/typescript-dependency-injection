import { Bar, Foo } from "./helperClasses";
import Transient from '../src/Descriptors/Transient';
import ServiceProvider from "../src/serviceProvider";
import { Mock } from 'moq.ts';

const mockServiceProvider = new Mock<ServiceProvider>().object();

describe("Transient", () => {
    test("Construction using fromFactory stores service name and implementation", () => {
        const serviceName = "MyService";

        const descriptor = Transient.ofType(serviceName, Bar);

        expect(descriptor.serviceName).toEqual(serviceName);
        const instance = new descriptor.constructorFunction();
        expect(instance instanceof Bar).toBeTruthy();
    });

    test("Able to store dependency list", () => {
        const serviceName = "MyService";

        const descriptor = Transient.ofType(serviceName, Foo).withDependencies(["A"]);

        expect(descriptor.dependencies).toEqual(["A"]);
    });
});