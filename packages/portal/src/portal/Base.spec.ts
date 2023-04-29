import {ServiceBroker} from "moleculer";

import {Configure, service} from "@tau-mud/core";

import {Base} from "./Base";

describe("Base", () => {
    class MixService extends service.Base {
        readonly name = "mix"
        readonly mixins = [Base]
    }

    const broker = new ServiceBroker(Configure("test", {
        transporter: "fake"
    }))

    beforeEach(async () => await broker.start())
    afterEach(async () => await broker.stop())

    describe("settings", () => {
        it("should default the defaultController to 'motd'", () => {
            const svc = broker.createService(MixService)
            expect(svc.settings.defaultController).toEqual("motd")
        })
    })

    describe("actions", () => {
        describe("deleteMetadata", () => {
            it("should throw a 501", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.deleteMetadata", {id: "id"})).rejects.toThrow("Not implemented")
            })

            it("requires an id", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.deleteMetadata")).rejects.toThrow("Parameters validation error!")
            })
        })

        describe("getMetadata", () => {
            it("should throw a 501", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.getMetadata", {id: "id", key: "key"})).rejects.toThrow("Not implemented")
            })

            it("requires an id", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.getMetadata")).rejects.toThrow("Parameters validation error!")
            })

            it("requires a key", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.getMetadata", {id: "id"})).rejects.toThrow("Parameters validation error!")
            })
        })


        describe("setMetadata", () => {
            it("should throw a 501", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.setMetadata", {
                    id: "id",
                    key: "key",
                    value: "value"
                })).rejects.toThrow("Not implemented")
            })

            it("requires an id", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.setMetadata")).rejects.toThrow("Parameters validation error!")
            })

            it("requires a key", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.setMetadata", {id: "id"})).rejects.toThrow("Parameters validation error!")
            })

            it("requires a value", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.setMetadata", {id: "id", key: "key"})).rejects.toThrow("Parameters validation error!")
            })
        })

        describe("write", () => {
            it("should throw a 501", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.write", {id: "id", data: "data"})).rejects.toThrow("Not implemented")
            })

            it("requires an id", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.write", {data: "data"})).rejects.toThrow("Parameters validation error!")
            })

            it("requires data", async () => {
                broker.createService(MixService)
                await broker.waitForServices("mix")
                await expect(broker.call("mix.write", {id: "id"})).rejects.toThrow("Parameters validation error!")
            })
        })
    })
})