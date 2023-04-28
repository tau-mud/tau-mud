import {ServiceBroker} from "moleculer";

import {before, getServiceHooksBefore} from "./before";
import {Base} from "./Base";

describe("before", () => {
    it("adds a before hook for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @before("greet")
            beforeGreet() {}
        }

        const target = new TestService(broker)

        const beforeHooks = getServiceHooksBefore(target)

        expect(beforeHooks).toEqual({
            greet: expect.arrayContaining([target.beforeGreet])
        })
    })

    it("appends additional hooks for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @before("greet")
            beforeGreet() {}

            @before("greet")
            beforeGreet2() {}
        }

        const target = new TestService(broker)

        const beforeHooks = getServiceHooksBefore(target)

        expect(beforeHooks).toEqual({
            greet: expect.arrayContaining([target.beforeGreet, target.beforeGreet2]),
        })
    })
})