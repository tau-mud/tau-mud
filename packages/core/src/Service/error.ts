import {ServiceHooksError} from "moleculer"

import {Base} from "./Base";
import {addHook, getHooks} from "./hooks";

const ERROR_HOOK = Symbol("ERROR_HOOK");

/**
 * This decorator adds a error hook for provided action name to the service.
 *
 * @param name the name of the action to add the hook for
 */
export function error(name: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        addHook(ERROR_HOOK, name, descriptor);
    }
}

/**
 * Returns an object containing all error hooks for the given service.
 *
 * @param service the service to get the hooks for
 */
export function getServiceHooksError(service: Base): ServiceHooksError {
    return getHooks(ERROR_HOOK, service) as ServiceHooksError;
}