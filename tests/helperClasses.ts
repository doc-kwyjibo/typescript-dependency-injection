export class Foo {
    foo(): any {
    }
}

export class Bar {
    constructor(private foo: Foo) {}

    bar(): void {
        this.foo.foo();
    }
}

export class Baz  {
    constructor(private foo: Foo) {}
    baz(): void {
        this.foo.foo();
    }
}

export class BarBaz {
    constructor(private bar:Bar, private baz: Baz) {}
    barbaz() : void {
        this.bar.bar();
        this.baz.baz();
    }
}