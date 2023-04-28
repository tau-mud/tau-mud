import {ServiceHooksBefore} from "moleculer"

import {Base} from "./Base";
import {addHook, getHooks} from "./hooks";

const BEFORE_HOOK = Symbol("BEFORE_HOOK");

/**
 * This decorator adds a before hook for provided action name to the service.
 *
 * @param name the name of the action to add the hook for
 */
export function before(name: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        addHook(BEFORE_HOOK, name, descriptor);
    }
}

/**
 * Returns an object containing all before hooks for the given service.
 *
 * @param service the service to get the hooks for
 */
export function getServiceHooksBefore(service: Base): ServiceHooksBefore {
    return getHooks(BEFORE_HOOK, service) as ServiceHooksBefore;
}