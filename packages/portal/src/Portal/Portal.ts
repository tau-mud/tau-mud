import {
    Context,
    Errors,
    ServiceBroker,
} from "moleculer";

import {Base} from "@tau-mud/core";

export interface IPortalSettings {
    defaultController: string;
}

export class Portal extends Base<IPortalSettings> {
    name = "portal"

    settings = {
        defaultController: "motd"
    }

    errorHook(ctx: Context, err: Error) {
    }

   //
    // hooks: {
    //     error: {
    //         async "*"(
    //             this: Service,
    //             ctx: Context<IPortalActionParams, IErrorMeta>,
    //             err
    //         ) {
    //             if (!ctx.meta.error) {
    //                 await this.actions.write(
    //                     {
    //                         id: ctx.params.id,
    //                         data: "Something went terribly wrong, please reconnect and try again later.",
    //                     },
    //                     { meta: { error: true } }
    //                 );
    //             }
    //             this.logger.error(err, { connectionId: ctx.params.id });
    //         },
    //     },
    // },
    //
    // actions: {
    //     deleteMetadata: {
    //         params: {
    //             id: "string",
    //         },
    //         hooks: {
    //             async after(this: Service, ctx: Context<IDeleteMetadataActionParams>) {
    //                 await this.broker.emit("portal.metadata.deleted", {
    //                     id: ctx.params.id,
    //                 });
    //             },
    //         },
    //     },
    //
    //     getAllMetadata: {
    //         params: {
    //             id: "string",
    //         },
    //         async handler(
    //             this: Service,
    //             _ctx: Context<IPortalGetMetadataActionParams>
    //         ) {
    //             throw new Errors.MoleculerError(
    //                 "Not implemented",
    //                 501,
    //                 "NOT_IMPLEMENTED"
    //             );
    //         },
    //     },
    //
    //     getMetadata: {
    //         params: {
    //             id: "string",
    //             key: "string",
    //         },
    //         async handler(this: Service, _ctx: Context<{ id: string; key: string }>) {
    //             throw new Errors.MoleculerError(
    //                 "Not implemented",
    //                 501,
    //                 "NOT_IMPLEMENTED"
    //             );
    //         },
    //     },
    //
    //     mergeMetadata: {
    //         params: {
    //             id: "string",
    //             data: "object",
    //         },
    //         hooks: {
    //             async after(
    //                 this: Service,
    //                 ctx: Context<IPortalMergeMetadataActionParams>
    //             ) {
    //                 for (const key of Object.keys(ctx.params.data)) {
    //                     await this.broker.emit("portal.metadata.set", {
    //                         id: ctx.params.id,
    //                         key,
    //                     });
    //                 }
    //             },
    //         },
    //         async handler(
    //             this: ServiceBroker,
    //             _ctx: Context<IPortalMergeMetadataActionParams>
    //         ) {
    //             throw new Errors.MoleculerError(
    //                 "Not implemented",
    //                 501,
    //                 "NOT_IMPLEMENTED"
    //             );
    //         },
    //     },
    //
    //     onConnect: {
    //         params: {
    //             id: "string",
    //         },
    //         visibility: "private",
    //         async handler(this: Service, ctx: Context<IPortalActionParams>) {
    //             return this.broker.emit("portal.connected", { id: ctx.params.id });
    //         },
    //         hooks: {
    //             async before(this: Service, ctx: Context<IPortalActionParams>) {
    //                 return this.actions.setMetadata({
    //                     id: ctx.params.id,
    //                     key: "portal",
    //                     value: this.name,
    //                 });
    //             },
    //             async after(this: Service, ctx: Context<IPortalActionParams>) {
    //                 await this.actions.writeLine({
    //                     id: ctx.params.id,
    //                     data: `Tau MUD Engine v${VERSION}`,
    //                 });
    //
    //                 await ctx.call("connections.register", {
    //                     id: ctx.params.id,
    //                     portal: this.name,
    //                 });
    //
    //                 return this.actions.setController({
    //                     id: ctx.params.id,
    //                     controller: this.settings.defaultController,
    //                 });
    //             },
    //         },
    //     },
    //
    //     onData: {
    //         params: {
    //             id: "string",
    //             data: "any",
    //         },
    //         visibility: "private",
    //         async handler(this: Service, ctx: Context<IPortalWriteActionParams>) {
    //             const metadata = await this.actions.getAllMetadata({
    //                 id: ctx.params.id,
    //             });
    //
    //             const controller = `controllers.${metadata.controller}`;
    //
    //             const data = ctx.params.data.toString().split(/\r?\n/);
    //
    //             for (const line of data) {
    //                 if (line.length > 0) {
    //                     await ctx.broker.call(`${controller}.receive`, {
    //                         id: ctx.params.id,
    //                         data: line,
    //                     });
    //                 }
    //             }
    //         },
    //     },
    //
    //     onDisconnect: {
    //         params: {
    //             id: "string",
    //         },
    //         visibility: "private",
    //         async handler(this: Service, ctx: Context<IPortalActionParams>) {
    //             return this.broker.emit("portal.disconnected", { id: ctx.params.id });
    //         },
    //     },
    //
    //     onTimeout: {
    //         params: {
    //             id: "string",
    //         },
    //         visibility: "private",
    //         async handler(this: Service, ctx: Context<IPortalActionParams>) {
    //             return this.broker.emit("portal.timeout", { id: ctx.params.id });
    //         },
    //     },
    //
    //     setController: {
    //         params: {
    //             id: "string",
    //             controller: "string",
    //         },
    //         hooks: {
    //             async after(
    //                 this: Service,
    //                 ctx: Context<IPortalSetControllerActionParams>
    //             ) {
    //                 return this.broker.emit("portal.controller.set", {
    //                     id: ctx.params.id,
    //                     controller: ctx.params.controller,
    //                 });
    //             },
    //         },
    //         async handler(
    //             this: Service,
    //             ctx: Context<IPortalSetControllerActionParams>
    //         ) {
    //             const metadata = await this.actions.getAllMetadata({
    //                 id: ctx.params.id,
    //             });
    //
    //             let connection = {
    //                 id: ctx.params.id,
    //                 ...metadata,
    //             };
    //
    //             if (metadata.controller) {
    //                 await ctx.call(`controllers.${metadata.controller}.stop`, {
    //                     id: ctx.params.id,
    //                     connection,
    //                 });
    //             }
    //
    //             await this.actions.mergeMetadata({
    //                 id: ctx.params.id,
    //                 data: {
    //                     controller: ctx.params.controller,
    //                 },
    //             });
    //
    //             connection.controller = ctx.params.controller;
    //
    //             return ctx.call(`controllers.${ctx.params.controller}.start`, {
    //                 id: ctx.params.id,
    //                 connection,
    //             });
    //         },
    //     },
    //
    //     setMetadata: {
    //         params: {
    //             id: "string",
    //             key: "string",
    //             value: "any",
    //         },
    //         hooks: {
    //             after(
    //                 this: ServiceBroker,
    //                 ctx: Context<{ id: string; key: string; value: any }>
    //             ) {
    //                 this.broker.emit("portal.metadata.set", {
    //                     id: ctx.params.id,
    //                     key: ctx.params.key,
    //                 });
    //             },
    //         },
    //         async handler(
    //             this: ServiceBroker,
    //             ctx: Context<{ id: string; key: string; value: any }>
    //         ) {
    //             throw new Errors.MoleculerError(
    //                 "Not implemented",
    //                 501,
    //                 "NOT_IMPLEMENTED"
    //             );
    //         },
    //     },
    //
    //     write: {
    //         params: {
    //             id: "string",
    //             data: "any",
    //         },
    //         async handler(
    //             this: ServiceBroker,
    //             _ctx: Context<IPortalWriteActionParams>
    //         ) {
    //             throw new Errors.MoleculerError(
    //                 "Not implemented",
    //                 501,
    //                 "NOT_IMPLEMENTED"
    //             );
    //         },
    //     },
    //
    //     writeLine: {
    //         params: {
    //             id: "string",
    //             data: "any",
    //         },
    //         async handler(
    //             this: ServiceBroker,
    //             ctx: Context<IPortalWriteActionParams>
    //         ) {
    //             if (typeof ctx.params.data === "string") {
    //                 ctx.params.data = Buffer.from(ctx.params.data + "\r\n");
    //             } else {
    //                 ctx.params.data = Buffer.concat([
    //                     ctx.params.data,
    //                     Buffer.from("\r\n"),
    //                 ]);
    //             }
    //
    //             return this.actions.write({
    //                 id: ctx.params.id,
    //                 data: ctx.params.data,
    //             });
    //         },
    //     },
    //
    //     writeLines: {
    //         params: {
    //             id: "string",
    //             data: "any",
    //         },
    //         async handler(
    //             this: ServiceBroker,
    //             ctx: Context<IPortalWriteActionParams>
    //         ) {
    //             const lines = ctx.params.data.toString().trim().split(/\r?\n/);
    //
    //             for (const line of lines) {
    //                 await this.actions.writeLine({
    //                     id: ctx.params.id,
    //                     data: line,
    //                 });
    //             }
    //         },
    //     },
    // },
    // name: "portal",
}
