import {
    ServiceMethods,
    Service as MoleculerService,
    ServiceActionsSchema,
    ServiceBroker,
    ServiceSchema
} from "moleculer";

import {Base} from "./Base";
import {getServiceActionSchema} from "./action";
import {defaultsDeep} from "lodash";
import {ITauOptions, ITauSettings} from "../Configure";

const NON_METHODS = [
    "constructor",
    "started",
    "stopped",
    "created",
    "Promise",
]

interface ServiceConstructor {
    new(broker: ServiceBroker): Base;
}

/**
 * Specialized Moleculer service factory for Tau MUD Engine services.
 */
export class ServiceFactory extends MoleculerService {
    constructor(broker: ServiceBroker, schema?: ServiceSchema | ServiceConstructor) {
        if (schema && schema instanceof Function && schema.prototype instanceof Base) {
            const instance = new (schema as ServiceConstructor)(broker);

            schema = parseService(instance, broker);
        }

        super(broker, schema);
    }
}

function parseService(service: Base, broker: ServiceBroker): ServiceSchema {
    const actions = getServiceActionSchema(service);

    // assign settings
    let settings = service.settings || {};
    const tauSettings = (broker.options as ITauOptions).settings || {} as ITauSettings;

    if (tauSettings.services[service.name]) {
        settings = defaultsDeep(settings, tauSettings.services[service.name]);
    }

    const schema: ServiceSchema = {
        name: service.name,
        settings,
        mixins: service.mixins,
        metadata: service.metadata,
        actions,
        methods: getServiceMethods(service, actions)
    }

    if (service.created) {
        schema.created = service.created;
    }

    if (service.started) {
        schema.started = service.started;
    }

    if (service.stopped) {
        schema.stopped = service.stopped;
    }

    return schema;
}

function getServiceMethods(service: Base, actions: ServiceActionsSchema): ServiceMethods {
    const actionNames = Object.keys(actions)

    // return all methods that are not actions
    const methods: ServiceMethods = {}

    Object.getOwnPropertyNames(Object.getPrototypeOf(service))
        .filter(method => typeof service[method] === "function")
        .filter(method => !NON_METHODS.includes(method))
        .filter(method => !actionNames.includes(method))
        .forEach((method) => methods[method] = service[method])

    return methods;
}