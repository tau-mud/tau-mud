import "reflect-metadata";
import {ActionSchema, ServiceActionsSchema} from "moleculer";
import {Service} from "./Service";

export const ACTION_SCHEMA = Symbol("ACTION_SCHEMA");

/**
 * Decorator to designate the method as an action. By default, if the action name is not specified, the method name will
 * be used as the action name.
 *
 * @param schema The [Moleculer ActionSchema](https://moleculer.services/docs/0.14/actions.html#Action-schema). of the
 *   action.
 */
export function action(schema: Partial<ActionSchema> = {}) {
    return function(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        schema = {
            ...schema,
            name: schema.name || propertyKey,
            handler: descriptor.value,
        }

        Reflect.defineMetadata(ACTION_SCHEMA, schema, descriptor.value);
    }
}

/**
 * Gets and returns the ServiceActionsSchema for an instance of a Tau MUD Engine service class.
 * @param service An instance of a Tau MUD Engine service class.
 */
export function getServiceActionSchema(service: Service): ServiceActionsSchema {
    const actions: ServiceActionsSchema = {};
    const proto = Object.getPrototypeOf(service);

    Object.getOwnPropertyNames(proto).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);

        const actionSchema = getActionSchema(descriptor as PropertyDescriptor);

        if (actionSchema) {
            actions[key] = actionSchema;
        }
    })

    return actions;
}

function getActionSchema(descriptor: PropertyDescriptor): ActionSchema {
    return Reflect.getMetadata(ACTION_SCHEMA, descriptor.value);
}

