import ServiceDescriptor from "./Descriptors/serviceDescriptor";
import { CyclicDependenciesError, DuplicateServiceNameError, MissingDependenciesError } from "./errors";
import ServiceProvider from "./serviceProvider";

export default class ServiceCollection {
    private descriptors: ServiceDescriptor[] = [];

    register(descriptor: ServiceDescriptor): ServiceCollection {

        if (this.descriptors.some(d => d.serviceName === descriptor.serviceName)) {
            throw new DuplicateServiceNameError(descriptor.serviceName, `Attempted to register duplicate service name ${descriptor.serviceName}`);
        }

        this.descriptors.push(descriptor);
        return this;
    }
    build(): ServiceProvider {

        // check for all dependencies first
        const missingDependencies = Helpers.FindMissingDependencies(this.descriptors);
        if (missingDependencies.length > 0) {
            throw new MissingDependenciesError(missingDependencies, "Some dependencies not registered with the service collection");
        }

        // check for cyclic dependencies
        if (Helpers.HasCyclicDependencies(this.descriptors)) {
            throw new CyclicDependenciesError();
        }

        return new ServiceProvider(this.descriptors);
    }
}

class Helpers {
    public static FindMissingDependencies(descriptors: ServiceDescriptor[]) : string[] {
        const serviceNames = new Set<string>(descriptors.map(d => d.serviceName));

        const missingDependencies: Set<string> = new Set<string>();

        // check each descriptor
        for (const descriptor of descriptors) {
            // check all of the descriptors dependencies
            for (const dependency of descriptor.dependencies) {
                // that there is a service name registered with the name of the dependency
                if (!serviceNames.has(dependency)) {
                    // if not, add it to the list of missing dependencies if not already present
                    if (!missingDependencies.has(dependency)) {
                        missingDependencies.add(dependency);
                    }
                }
            }
        }

        return [...missingDependencies];
    }

    public static HasCyclicDependencies(descriptors: ServiceDescriptor[]) : boolean {
        if (descriptors.length === 0) {
            // an empty definition set is defined to be non-cyclic
            return false;
        }
        const definitions = new Map<string, string[]>(descriptors.map(d => [d.serviceName, d.dependencies]));
        
        for (const [key, _] of definitions) {
            if (Helpers.HasCyclicDependenciesSearch(definitions, key)) {
                // stop searching if we find one cyclic dependency
                return true;
            }
        }
        return false;
    }
    
    private static HasCyclicDependenciesSearch(definitions: Map<string, string[]>, identifier: string) : boolean {

        const internalSearch = function(currentIdentifier: string, stack: string[], visited: Set<string>) : boolean {
            
            if (visited.has(currentIdentifier)) {
                return stack.includes(currentIdentifier);
            }
    
            visited.add(currentIdentifier);
            const newStack = stack.concat(currentIdentifier);
    
            return definitions.get(currentIdentifier)?.some(k => internalSearch(k, newStack, visited)) ?? false;
        }
    
        return internalSearch(identifier, [], new Set<string>());
    }
}