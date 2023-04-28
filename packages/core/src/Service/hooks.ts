import {excludeMethod, Base} from "./Base";

interface HookSchema {
    [name: string]: Function[]
}

/**
 * Adds lifecycle a hook to the service for the given Symbol
 *
 * @param symbol the symbol representing the type of hook to add
 * @param name the name of the hook
 * @param descriptor the property descriptor of the method to add as a hook
 */
export function addHook(symbol: Symbol, name: string, descriptor: PropertyDescriptor) {
    excludeMethod(descriptor)
    Reflect.defineMetadata(symbol, name, descriptor.value);
}

/**
 * Returns an array of all hooks for the given symbol on the given service.
 * @param symbol the symbol representing the type of hook to get
 * @param service the service to get the hooks for
 */
export function getHooks(symbol: Symbol, service: Base): HookSchema {
    const hooks: HookSchema = {};

    const proto = Object.getPrototypeOf(service);

    Object.getOwnPropertyNames(proto).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);

        if (descriptor) {
            const hookName = Reflect.getMetadata(symbol, descriptor.value);

            if (hookName) {
                hooks[hookName] = hooks[hookName] || [];
                hooks[hookName].push(descriptor.value);
            }
        }
    })

    return hooks;
}
