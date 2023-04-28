import {ServiceHooksBefore, ActionHookBefore} from "moleculer"

import {Service} from "./Service";
import {addHook, getHooks} from "./before_and_after_hooks";

export const BEFORE_HOOK = Symbol("BEFORE_HOOK");

export function before(name: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        addHook(BEFORE_HOOK, name, descriptor);
    }
}

export function getServiceHooksBefore(service: Service): ServiceHooksBefore {
    return getHooks(BEFORE_HOOK, service) as ServiceHooksBefore;
}