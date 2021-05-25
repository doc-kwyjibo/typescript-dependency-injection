# Dependency Injection for Typescript

## Motivation
Common dependency injection packages in typescript, such as `tsyringe` or `inversify` rely on the `reflect-metadata` package to determine argument types and perform autowiring when constructing instances. In order to accomplish this functionality, decorators must be used to provide type information. The requirement to use decorators throughout the codebase adds increased complexity as there is no single location where all dependency information is maintained.

Without the use of reflection, the consumer is responsible for labeling services that will be available through the dependency injection container, as well as providing a dependency list for each service. This package takes the approach of using a string label for each service, as well as a string array for its dependencies, to remove the need for decorators and to permit dependency information to be defined in a single location. An additional benefit of this approach is that the library is not restricted to TypeScript, but can be used within JavaScript projects as well.

## Features
- Simple and powerful framework
- Suitable for both JavaScript and TypeScript
- Does not require the use of decorators

## Usage

```typescript
import ServiceCollection, { Singleton, Transient } from '@kwyjibo/typescript-dependency-injection';

class Foo {}
class Bar {
    constructor(public foo: Foo) {}
}

const container = new ServiceCollection()
                    .registerService(Singleton.ofType("Foo", Foo))
                    .registerService(Transient.ofType("Bar", Bar).withDependencies(["Foo"]))
                    .build();

const bar = container.resolve<Bar>("Bar");
```

Services registered with `Singleton` will only be constructed once for the lifetime of the container, while services registered as `Transient` will be constructed each time the service is requested. Services registered as `Instance` will return the provided instance for all requests.