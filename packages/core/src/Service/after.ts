import { ServiceHooksBefore } from "moleculer";

import {addHook, getHooks} from "./before_and_after_hooks";
import {Base} from "./Base";

const AFTER_HOOK = Symbol("AFTER_HOOK");

/**
 * This decorator adds an after hook for provided action name to the service.
 *
 * @param name the name of the action to add the hook for
 */
export function after(name: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        addHook(AFTER_HOOK, name, descriptor);
    }
}

/**
 * Returns an object containing all after hooks for the given service.
 *
 * @param service the service to get the hooks for
 */
export function getServiceHooksAfter(service: Base): ServiceHooksBefore {
    return getHooks(AFTER_HOOK, service) as ServiceHooksBefore;
}
