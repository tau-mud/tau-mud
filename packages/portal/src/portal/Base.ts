import {
    Context,
    Errors,
    ServiceBroker,
} from "moleculer";

import {
    IDeleteMetadataActionParams,
    IGetAllMetadataActionParams,
    IGetMetadataActionParams,
    IMergeMetadataActionParams,
    IOnSocketDataActionParams,
    ISetMetadataActionParams,
    ISocketActionParams,
    IWriteActionParams,
} from "moleculer-telnet";

import {service} from "@tau-mud/core";
import {Service} from "@tau-mud/core/lib/Service/Service";

const {error, action} = service;

export interface IPortalSettings {
    defaultController: string;
}

/**
 * The parameters for the {@link Base} connection callbacks.
 */
export interface IPortalActionParams extends ISocketActionParams {
}

/**
 * The parameters for the {@link Base} `setMetadata` action.
 */
export interface IPortalSetMetadataActionParams
    extends ISetMetadataActionParams {}

/**
 * The parameters for the {@link Base} `deleteMetadata` action.
 */
export interface IPortalDeleteMetadataActionParams
    extends IDeleteMetadataActionParams {}

/**
 * The parameters for the {@link Base} `getAllMetadata` action.
 */
export interface IPortalGetAllMetadataActionParams
    extends IGetAllMetadataActionParams {}

/**
 * The parameters for the {@link Base} `getMetadata` action.
 */
export interface IPortalGetMetadataActionParams
    extends IGetMetadataActionParams {}

/**
 * The parameters for the {@link Base} `mergeMetadata` action.
 */
export interface IPortalMergeMetadataActionParams
    extends IMergeMetadataActionParams {}

/**
 * The parameters for the {@link Base} `onData` action.
 */
export interface IPortalOnDataActionParams extends IOnSocketDataActionParams {}

/**
 *
 * The parameters for the {@link Base} `write` actions.
 */
export interface IPortalWriteActionParams extends IWriteActionParams {}

/**
 * The parameters for the {@link Base} `setController` action.
 */
export interface IPortalSetControllerActionParams extends IPortalActionParams {
    /**
     * The name of the controller to set.
     */
    controller: string;
}

/**
 * Used to ensure we don't enter an infinite loop when an error occurs within a portal.
 */
interface IErrorMeta {
    error: boolean;
}

/**
 * The Portal mixin provides the base Portal functionality. A Portal is a server by which a game client can connect to
 * the game. As each Portal may be uniquely designed to talk to a different type of client, the Portal mixin requires
 * the implementation to override the following actions to provide the necessary functionality:
 *
 * - {@link deleteMetadata}
 * - {@link getAllMetadata}
 * - {@link getMetadata}
 * - {@link mergeMetadata}
 * - {@link setMetadata}
 * - {@link write}
 *
 * ### Understanding Metadata
 * Information about the active connection is stored in the connections `metadata`. This may include information about
 * the user's connection, such as their ip address or their client configuration, but also includes information about
 * how their connection interactions should be processed .i.e. the current controller that is handling their input.
 *
 * ### Settings
 * | Setting | Type | Default | Description |
 * | ------- | ---- | ------- | ----------- |
 * | `defaultController` | `string` | `motd` | The name of the controller to use when a connection is first established. |
 *
 * ### Actions
 * | Action | Params | Override? | Privacy | Description |
 * | ------ | ------ | --------- | ------- | ----------- |
 * | {@link deleteMetadata} | {@link IPortalDeleteMetadataActionParams} | Yes | `public` | Delete the metadata for a connection. This action will emit the `portal.metadata.deleted` event. |
 * | {@link getAllMetadata} | {@link IPortalGetAllMetadataActionParams} | Yes | `public` | Get all metadata for a connection. |
 * | {@link getMetadata} | {@link IPortalGetMetadataActionParams} | Yes | `public` | Get a specific metadata value for a connection. |
 * | {@link mergeMetadata} | {@link IMergeMetadataActionParams} | Yes | `public` | Merge metadata for a connection. This action will emit the `portal.metadata.set` event for each key that was merged. |
 * | {@link setMetadata} | {@link ISetMetadataActionParams} | Yes | `public` | Set metadata for a connection. This action will emit the `portal.metadata.set` event. |
 * | {@link onConnect} | {@link IPortalActionParams} | Yes | `private` | Called when a connection is established. This action will emit the `portal.connected` event. |
 * | {@link onData} | {@link IPortalOnDataActionParams} | No | `private` | Called when data is received from a connection. |
 * | {@link onDisconnect} | {@link IPortalActionParams} | Yes | `private` | Called when a connection is terminated. This action will emit the `portal.disconnected` event. |
 * | {@link onTimeout} | {@link IPortalActionParams} | Yes | `private` | Called when a connection times out. This action will emit the `portal.timeout` event. |
 * | {@link write} | {@link IWriteActionParams} | Yes | `public` | Write data to a connection. |
 * | {@link setController} | {@link IPortalSetControllerActionParams} | Not | `public` | Set the controller for a connection. |
 * | {@link writeLine} | {@link IPortalWriteActionParams} | No | `public` | Write a line of data to a connection. |
 * | {@link writeLines} | {@link IPortalWriteActionParams} | No | `public` | Write multiple lines of data to a connection. |
 *
 * ### Events
 */
export class Base extends service.Base<IPortalSettings> {
    name = "portal"
    settings = {
        defaultController: "motd"
    }

    /**
     * The error hook is used to ensure the client is notified if an error occurs while processing their input.
     *
     * @param ctx The context of the action that errored.
     * @param err The error that occurred.
     */
    @error("*")
    async errorHook(ctx: Context<IPortalActionParams, IErrorMeta>, err: Error) {
        // the error meta property ensures we don't enter an infinite loop when handling an error
        if (!ctx.meta.error) {
            await this.actions.write(
                {
                    id: ctx.params.id,
                    data: "Something went terribly wrong, please reconnect and try again later.",
                },
                {meta: {error: true}}
            );
        }

        this.logger.error(err, {connectionId: ctx.params.id});
    }


    /**
     * Override this action with the Portal specific method of deleting metadata.
     *
     *
     * @param ctx The delete metadata action context.
     */
    @action({
        params: {
            id: "string",
        },
        hooks: {
            async after(this: Service, ctx: Context<IDeleteMetadataActionParams>) {
                await this.broker.emit("portal.metadata.deleted", {
                    id: ctx.params.id,
                });
            },
        }
    })
    deleteMetadata(_ctx: Context<IDeleteMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Override this action with the Portal specific method of getting all metadata for a connection.
     *
     * @param ctx context for the get all metadata action.
     */
    @action({
        params: {
            id: "string",
        }
    })
    async getAllMetadata(_ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Override this action with the Portal specific method of getting a specific metadata property for a connection.
     *
     * @param ctx context for the get metadata action.
     */
    @action({
        params: {
            id: "string",
            key: "string",
        },
    })
    async getMetadata(_ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Override this action with the Portal specific method of merging an object into the connections metadata
     *
     * @param ctx context for the merge metadata action.
     */
    @action({
        params: {
            id: "string",
            data: "object",
        },
        hooks: {
            async after(
                this: Service,
                ctx: Context<IPortalMergeMetadataActionParams>
            ) {
                for (const key of Object.keys(ctx.params.data)) {
                    await this.broker.emit("portal.metadata.set", {
                        id: ctx.params.id,
                        key,
                    });
                }
            },
        },
    })
    async mergeMetadata(_ctx: Context<IPortalMergeMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Override this action the Portal specific implementation of handling a new connection.
     *
     * @param ctx context for the set metadata action.
     */
    @action({
        params: {
            id: "string",
        },
        visibility: "private",
        async handler(this: Service, ctx: Context<IPortalActionParams>) {
            return this.broker.emit("portal.connected", {id: ctx.params.id});
        },
        hooks: {
            async before(this: Service, ctx: Context<IPortalActionParams>) {
                return this.actions.setMetadata({
                    id: ctx.params.id,
                    key: "portal",
                    value: this.name,
                });
            },
            async after(this: Service, ctx: Context<IPortalActionParams>) {
                await this.actions.writeLine({
                    id: ctx.params.id,
                    // data: `Tau MUD Engine v${VERSION}`,
                });

                await ctx.call("connections.register", {
                    id: ctx.params.id,
                    portal: this.name,
                });

                return this.actions.setController({
                    id: ctx.params.id,
                    controller: this.settings.defaultController,
                });
            },
        },
    })
    onConnect(_ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * This action is to be called when a client sends data to the server. The Portal implementation will be
     * responsible for calling this action when data is received from the client socket. Data received will be passed
     * to the controller for processing.
     *
     * @param ctx context for the set metadata action.
     */
    @action({
        params: {
            id: "string",
            data: "any",
        },
        visibility: "private",
    })
    async onData(ctx: Context<IPortalWriteActionParams>) {
        const metadata = await this.actions.getAllMetadata({
            id: ctx.params.id,
        });

        const controller = `controllers.${metadata.controller}`;

        const data = ctx.params.data.toString().split(/\r?\n/);

        for (const line of data) {
            if (line.length > 0) {
                await ctx.broker.call(`${controller}.receive`, {
                    id: ctx.params.id,
                    data: line,
                });
            }
        }
    }

    /**
     * Override this action with the Portal specific implementation of handling a client disconnect.
     *
     * @param ctx context for the disconnect action.
     */
    @action({
        params: {
            id: "string",
        },
        visibility: "private",
    })
    onDisconnect(ctx: Context<IPortalActionParams>) {
        return this.broker.emit("portal.disconnected", {id: ctx.params.id});
    }


    /**
     * Override this action with the Portal specific implementation of handling a client timeout.
     *
     * @param ctx context for the timeout action.
     */
    @action({
        params: {
            id: "string",
        },
        visibility: "private",
    })
    onTimeout(ctx: Context<IPortalActionParams>) {
        return this.broker.emit("portal.timeout", {id: ctx.params.id});
    }

    /**
     * Sets the controller for a connection.
     *
     * @param ctx context for the set controller action.
     */
    @action({
        params: {
            id: "string",
            controller: "string",
        },
        hooks: {
            async after(
                this: Service,
                ctx: Context<IPortalSetControllerActionParams>
            ) {
                return this.broker.emit("portal.controller.set", {
                    id: ctx.params.id,
                    controller: ctx.params.controller,
                });
            },
        },
    })
    async setController(ctx: Context<IPortalSetControllerActionParams>) {
        const metadata = await this.actions.getAllMetadata({
            id: ctx.params.id,
        });

        let connection = {
            id: ctx.params.id,
            ...metadata,
        };

        if (metadata.controller) {
            await ctx.call(`controllers.${metadata.controller}.stop`, {
                id: ctx.params.id,
                connection,
            });
        }

        await this.actions.mergeMetadata({
            id: ctx.params.id,
            data: {
                controller: ctx.params.controller,
            },
        });

        connection.controller = ctx.params.controller;

        return ctx.call(`controllers.${ctx.params.controller}.start`, {
            id: ctx.params.id,
            connection,
        });
    }

    /**
     * Override this action with the Portal specific method of setting a specific metadata property for a connection.
     *
     * @param ctx context for the set metadata action.
     */
    @action({
        params: {
            id: "string",
            key: "string",
            value: "any",
        },
        hooks: {
            after(
                this: ServiceBroker,
                ctx: Context<{ id: string; key: string; value: any }>
            ) {
                this.broker.emit("portal.metadata.set", {
                    id: ctx.params.id,
                    key: ctx.params.key,
                });
            },
        }
    })
    setMetadata(_ctx: Context<IPortalSetMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Override this action with the Portal specific implementation of writing data to the client socket.
     *
     * @param ctx context for the write action.
     */
    @action({
        params: {
            id: "string",
            data: "any",
        },
    })
    write(_ctx: Context<IPortalWriteActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    /**
     * Writes a line of data to the client socket.
     *
     * @param ctx context for the write action.
     */
    @action({
        params: {
            id: "string",
            data: "any",
        },
    })
    writeLine(ctx: Context<IPortalWriteActionParams>) {
        if (typeof ctx.params.data === "string") {
            ctx.params.data = Buffer.from(ctx.params.data + "\r\n");
        } else {
            ctx.params.data = Buffer.concat([
                ctx.params.data,
                Buffer.from("\r\n"),
            ]);
        }

        return this.actions.write({
            id: ctx.params.id,
            data: ctx.params.data,
        });
    }

    /**
     * Writes multiple lines of data to the client socket.
     *
     * @param ctx
     */
    @action({
        params: {
            id: "string",
            data: "any",
        },
    })
    async writeLines(ctx: Context<IPortalWriteActionParams>) {
        const lines = ctx.params.data.toString().trim().split(/\r?\n/);

        for (const line of lines) {
            await this.actions.writeLine({
                id: ctx.params.id,
                data: line,
            });
        }
    }
}
