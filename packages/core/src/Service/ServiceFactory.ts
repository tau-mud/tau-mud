import {Service as MoleculerService, ServiceActionsSchema, ServiceBroker, ServiceSchema} from "moleculer";
import {Service} from "./Service";
import {ACTION_SCHEMA, getServiceActionSchema} from "./action";

interface ServiceConstructor {
    new(broker: ServiceBroker): Service;
}

export class ServiceFactory extends MoleculerService {
    constructor(broker: ServiceBroker, schema?: ServiceSchema | ServiceConstructor) {
        if (schema) {
            if (Object.getPrototypeOf(schema.prototype) === Service.prototype) {
                schema = parseService(new (schema as ServiceConstructor)(broker));
            }
        }

        super(broker, schema);
    }
}

/**
 * Parses a Tau MUD Engine service into a Moleculer service schema.
 *
 * @param service a Tau MUD Engine service.
 */
function parseService(service: Service): ServiceSchema {
    const actions = getServiceActionSchema(service);

    return {
        name: service.name,
        actions,
    }
}