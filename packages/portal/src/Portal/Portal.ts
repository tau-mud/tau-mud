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
 * The parameters for the {@link Portal} connection callbacks.
 */
export interface IPortalActionParams extends ISocketActionParams {
}

/**
 * The parameters for the {@link Portal} `setMetadata` action.
 */
export interface IPortalSetMetadataActionParams
    extends ISetMetadataActionParams {}

/**
 * The parameters for the {@link Portal} `deleteMetadata` action.
 */
export interface IPortalDeleteMetadataActionParams
    extends IDeleteMetadataActionParams {}

/**
 * The parameters for the {@link Portal} `getAllMetadata` action.
 */
export interface IPortalGetAllMetadataActionParams
    extends IGetAllMetadataActionParams {}

/**
 * The parameters for the {@link Portal} `getMetadata` action.
 */
export interface IPortalGetMetadataActionParams
    extends IGetMetadataActionParams {}

/**
 * The parameters for the {@link Portal} `mergeMetadata` action.
 */
export interface IPortalMergeMetadataActionParams
    extends IMergeMetadataActionParams {}

/**
 * The parameters for the {@link Portal} `onData` action.
 */
export interface IPortalOnDataActionParams extends IOnSocketDataActionParams {}

/**
 *
 * The parameters for the {@link Portal} `write` actions.
 */
export interface IPortalWriteActionParams extends IWriteActionParams {}

/**
 * The parameters for the {@link Portal} `setController` action.
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

export class Portal extends service.Base<IPortalSettings> {
    name = "portal"

    settings = {
        defaultController: "motd"
    }

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
    deleteMetadata(ctx: Context<IDeleteMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    @action({
        params: {
            id: "string",
        }
    })
    async getAllMetadata(ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    @action({
        params: {
            id: "string",
            key: "string",
        },
    })
    async getMetadata(ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

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
    async mergeMetadata(ctx: Context<IPortalMergeMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

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
    onConnect(ctx: Context<IPortalActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

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

    @action({
        params: {
            id: "string",
        },
        visibility: "private",
    })
    onDisconnect(ctx: Context<IPortalActionParams>) {
        return this.broker.emit("portal.disconnected", {id: ctx.params.id});
    }


    @action({
        params: {
            id: "string",
        },
        visibility: "private",
    })
    onTimeout(ctx: Context<IPortalActionParams>) {
        return this.broker.emit("portal.timeout", {id: ctx.params.id});
    }

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
    setMetadata(ctx: Context<IPortalSetMetadataActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

    @action({
        params: {
            id: "string",
            data: "any",
        },
    })
    write(ctx: Context<IPortalWriteActionParams>) {
        throw new Errors.MoleculerError(
            "Not implemented",
            501,
            "NOT_IMPLEMENTED"
        );
    }

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
