import "reflect-metadata";
import {Service as MoleculerService, ServiceSettingSchema } from "moleculer";

export const EXCLUDE_METHOD = Symbol("EXCLUDE_METHOD");

/**
 * A Tau MUD Service is a Moleculer Service designed to be loaded within a Tau MUD Engine based game.
 *
 * ### Settings
 * Defining the settings for a Tau MUD Engine `Service` defines the default settings. They can be overridden by
 * overriding the `settings.services.<service-name>` object in the Tau MUD Engine configuration, and the service
 * `settings` object will be extended using `defaultsDeep`. Example:
 *
 * ```typescript
 * import {Service} from "@tau-mud/core";
 *
 * export class MyService extends Service {
 *    name = "my-service";
 *    settings = {
 *      mySetting: "default value"
 *      myOtherSetting: "default value"
 *    }
 * }
 *
 * // portal.config.ts
 * import { Configure } from "@tau-mud/core";
 *
 * export default Configure("portal", {
 *     settings: {
 *       services: {
 *         "my-service": {
 *            mySetting: "overridden value"
 *         }
 *      }
 *   }
 * }
 * ```
 */
export abstract class Base<S = ServiceSettingSchema> extends MoleculerService<S> {
    abstract readonly name: string;
    settings: S = {} as S;
}

/**
 * Marks a service method as excluded from the service schema.
 */
export function excludeMethod(descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(EXCLUDE_METHOD, true, descriptor.value);
}