
import { Bar, BarBaz, Baz, Foo } from "./helperClasses";
import ServiceCollection from '../src/serviceCollection';
import Singleton from '../src/Descriptors/singleton';
import Transient from '../src/Descriptors/transient';

describe("Integration tests", () => {
    it("Can setup container and construct instance", () => {
        const container = new ServiceCollection()
                    .registerService(Singleton.fromInstance("Foo", new Foo()))
                    .registerService(Transient.ofType("Bar", Bar).withDependencies(["Foo"]))
                    .registerService(Singleton.fromFactory("Baz", (p) => new Baz(p.resolve<Foo>("Foo"))))
                    .registerService(Singleton.ofType("BarBaz", BarBaz).withDependencies(["Bar", "Baz"]))
                    .build();

        const barBaz = container.resolve<BarBaz>("BarBaz");

        expect(barBaz instanceof BarBaz).toBeTruthy();
        expect(() => barBaz.barbaz()).not.toThrowError();
    })
})