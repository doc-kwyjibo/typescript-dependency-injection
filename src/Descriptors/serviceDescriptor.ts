export interface Type<T> extends Function {
    new (...args: any[]): T;
}

export default interface ServiceDescriptor {
    readonly serviceName: string;

    readonly constructorFunction: Type<any>;

    readonly dependencies: string[];
}