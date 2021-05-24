export class DuplicateServiceNameError extends Error {
    constructor(public serviceName: string, message?: string) {
        super(message);
    }
}

export class CyclicDependenciesError extends Error {
    constructor() {
        super();
    }
}

export class MissingDependenciesError extends Error {
    constructor(public missingServiceNames: string[], message?: string) {
        super(message);
    }
}