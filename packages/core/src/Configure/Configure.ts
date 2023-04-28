import {BrokerOptions, Service, ServiceBroker} from "moleculer";

import {ServiceFactory} from "../Service/ServiceFactory";


/**
 * A plugin is the primary way to extend the functionality of a Tau MUD process. Plugins simply extend the options
 * available to configure a Tau MUD process with. You can hook into the startup and shutdown of the process by
 * using the `created`, `started`, and `stopped` hooks. If defined on the plugin they will be called at the
 * appropriate time.
 */
export interface IPlugin extends Partial<BrokerOptions>{}

/**
 * The options to configure a Tau MUD process with. This is a superset of the
 * [Moleculer BrokerOptions](https://moleculer.services/docs/0.14/broker.html#Broker-options).
 */
export interface ITauOptions extends Partial<BrokerOptions>{
    /**
     * If set to `true`, the nodeID will remain unchanged this will enforce only a single copy of the process to run on
     * the same cluster. If set to `false` or is not set, the nodeID will be appended with the process ID of the current
     * process. This will allow multiple copies of the process to run on the same cluster.
     */
    unique?: boolean | undefined;

    /**
     * A list of plugins to load into the process.
     */
    plugins?: IPlugin[];

    /**
     * Tau MUD Engine settings. This will be loaded into the `settings` service.
     */
    settings?: ITauSettings;
}


/**
 * The Tau MUD Engine settings. This will be loaded into the `settings` service.
 */
export interface ITauSettings {
    /**
     * Individual services can be configured here. The values here will be deep merged into the service's `settings`.
     */
    services: {
        [name: string]: any;
    }
}


/**
 * Configure a Tau MUD process.
 *
 * @param nodeID The node ID of the process. If the `unique` option is set to `true`, the nodeID will remain unchanged
 *  this will enforce only a single copy of the process to run on the same cluster. If the `unique` option is set to
 *  `false` or is not set, the nodeID will be appended with the process ID of the current process. This will allow
 *  multiple copies of the process to run on the same cluster.
 * @param options The options to configure the process with. This is a superset of the
 *  [Moleculer BrokerOptions](https://moleculer.services/docs/0.14/broker.html#Broker-options).
 * @constructor
 */
export function Configure(nodeID: string, options: ITauOptions = {}): BrokerOptions {
    nodeID = options.unique ? nodeID : `${nodeID}-${process.pid}`
    delete options.unique;

    const created = function(broker: ServiceBroker) {
        if (options.created) {
            options.created(broker);
        }

        if (options.plugins) {
            options.plugins.forEach(plugin => {
                if (plugin.created) {
                    plugin.created(broker);
                }
            })
        }
    }

    const started = function(broker: ServiceBroker) {
        if (options.started) {
            options.started(broker);
        }

        if (options.plugins) {
            options.plugins.forEach(plugin => {
                if (plugin.started) {
                    plugin.started(broker);
                }
            })
        }
    }

    const stopped = function(broker: ServiceBroker) {
        if (options.stopped) {
            options.stopped(broker);
        }

        if (options.plugins) {
            options.plugins.forEach(plugin => {
                if (plugin.stopped) {
                    plugin.stopped(broker);
                }
            })
        }
    }

    return {
        nodeID,
        ...options,
        created,
        started,
        stopped,
        ServiceFactory: ServiceFactory as typeof Service,
    }
}