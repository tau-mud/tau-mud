import {ServiceBroker} from "moleculer";

import {Configure, service} from "@tau-mud/core";

import { Base } from "./Base";

describe("Base", () => {
    class MixService extends service.Base {
        readonly name = "mix"
        readonly mixins = [Base]
    }

    const broker = new ServiceBroker(Configure("test", {
        transporter: "fake"
    }))

    beforeEach(() => broker.start())
    afterEach(() => broker.stop())

    it("should default the defaultController to 'motd'", () => {
        const svc = broker.createService(MixService)
        expect(svc.settings.defaultController).toEqual("motd")
    })
})