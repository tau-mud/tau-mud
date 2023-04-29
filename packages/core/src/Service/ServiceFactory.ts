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

    if (tauSettings.services && tauSettings.services[service.name]) {
        settings = defaultsDeep(settings, tauSettings.services[service.name]);
    }

    const mixins = parseMixins(service.mixins, broker);

    const schema: ServiceSchema = {
        name: service.name,
        settings,
        mixins,
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

function parseMixins(mixins: (Base | ServiceSchema)[], broker: ServiceBroker): ServiceSchema[] {
    if (!mixins) {
        return [];
    }

    return mixins.map(mixin => {
        if (typeof mixin === "function" && Object.getPrototypeOf(mixin) === Base) {
            return parseService(new (mixin as ServiceConstructor)(broker), broker);
        }

        return mixin;
    })
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
