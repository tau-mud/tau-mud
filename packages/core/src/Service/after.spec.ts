import {ServiceBroker} from "moleculer";

import {after, getServiceHooksAfter} from "./after";
import {Base} from "./Base";

describe("after", () => {
    it("adds a after hook for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @after("greet")
            afterGreet() {}
        }

        const target = new TestService(broker)

        const afterHooks = getServiceHooksAfter(target)

        expect(afterHooks).toEqual({
            greet: expect.arrayContaining([target.afterGreet])
        })
    })

    it("appends additional hooks for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @after("greet")
            afterGreet() {}

            @after("greet")
            afterGreet2() {}
        }

        const target = new TestService(broker)

        const afterHooks = getServiceHooksAfter(target)

        expect(afterHooks).toEqual({
            greet: expect.arrayContaining([target.afterGreet, target.afterGreet2]),
        })
    })
})