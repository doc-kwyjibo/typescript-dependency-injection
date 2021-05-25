import ServiceProvider from "../serviceProvider";

export interface Type<T> extends Function {
    new (...args: any[]): T;
};

export interface Factory<T> extends Function {
    (provider: ServiceProvider): T
};

export enum ServiceLifetime {
    Singleton,
    Transient
};

export default interface ServiceDescriptor {
    readonly serviceName: string;

    readonly constructorFunction: Type<any> | null;
    readonly factoryFunction: Factory<any> | null;

    readonly dependencies: string[];

    readonly lifetime: ServiceLifetime;
}