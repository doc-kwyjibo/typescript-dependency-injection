export class Foo {
    foo(): any {
        console.log("foo");
    }
}

export class Bar {
    constructor(private foo: Foo) {}

    bar(): void {
        console.log("bar");
        this.foo.foo();
    }
}