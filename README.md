# Dependency Injection for Typescript

![GitHub Workflow Status](https://github.com/doc-kwyjibo/typescript-dependency-injection/actions/workflows/build.yml/badge.svg)

[![npm](https://img.shields.io/npm/v/typescript-dependency-injection.svg)](https://www.npmjs.com/package/typescript-dependency-injection)

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
class Baz {
    constructor(public foo: Foo) {}
}
class BarBaz {
    constructor(public bar: Bar, public baz: Baz) {}
}

const container = new ServiceCollection()
                    .registerService(Singleton.fromInstance("Foo", new Foo()))
                    .registerService(Transient.ofType("Bar", Bar).withDependencies(["Foo"]))
                    .registerService(Singleton.fromFactory("Baz", (p) => new Baz(p.resolve<Foo>("Foo"))))
                    .registerService(Singleton.ofType("BarBaz", BarBaz).withDependencies(["Bar", "Baz"]))
                    .build();

const bar = container.resolve<Bar>("Bar");
```

Services registered with `Singleton` will only be constructed once for the lifetime of the container, while services registered as `Transient` will be constructed each time the service is requested. Services registered as `Instance` will return the provided instance for all requests.

Note: Service names do not need to correspond to implentation or class names. This is only done for clarity and code maintenance.

### Singleton instances
Singleton instances are constructed from the `Singleton` service descriptor. A singleton instance will only be constructed once for the lifetime of the container. There are three construction methods provided for creating singleton instances:
- `Singleton.ofType` constructs an instance based on a constructor function of a defined type;
```typescript
class Foo {}
const descriptor = Singleton.ofType("Service", Foo);
```
Dependencies can be specified as an array of service names in the `.withDependencies` method.
```typescript
class Foo {}
class Bar {
    constructor(public foo: Foo) {}
}
const fooDescriptor = Singleton.ofType("ServiceName", Foo);
const barDescriptor = Singleton.ofType("BarService", Bar).withDependencies(["ServiceName"]);
```

- `Singleton.fromInstance` stores a reference to the instance to be returned when the service is requested; and
```typescript
class Foo {}
const descriptor = Singleton.fromInstance("Service", new Foo());
```
- `Singleton.fromFactory` provides a callback function that has the `ServiceProvider` available to construct more complex instances.
```typescript
class Foo {
    constructor (public value: number) {}
}

function serviceFactory(provider: ServiceProvider) {
    const rngService = provider.resolve<RngService>("RandomNumberGenerator");
    const randomNumber = rngService.getNumber();
    return new Foo(randomNumber);
}

const descriptor = Singleton.fromFactory("Service", serviceFactory);
```

### Transient instances
Transient instances are constructed from the `Transient` service descriptor. A new transient instance will be constructed each time one is requested from the container.

Transient instances can only be constructed by specifying a constructor function.
```typescript
class Foo {}
const descriptor = Transient.ofType("Service", Foo);
```
Dependencies can be specified as an array of service names in the `.withDependencies` method.
```typescript
class Foo {}
class Bar {
    constructor(public foo: Foo) {}
}
const fooDescriptor = Transient.ofType("ServiceName", Foo);
const barDescriptor = Transient.ofType("BarService", Bar).withDependencies(["ServiceName"]);
```
