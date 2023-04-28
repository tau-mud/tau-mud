import {ServiceBroker} from "moleculer";

import {error, getServiceHooksError} from "./error";
import {Base} from "./Base";

describe("error", () => {
    it("adds a error hook for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @error("greet")
            errorGreet() {}
        }

        const target = new TestService(broker)

        const errorHooks = getServiceHooksError(target)

        expect(errorHooks).toEqual({
            greet: expect.arrayContaining([target.errorGreet])
        })
    })

    it("appends additional hooks for the given name", () => {
        const broker = new ServiceBroker();

        class TestService extends Base {
            name = "test";

            @error("greet")
            errorGreet() {}

            @error("greet")
            errorGreet2() {}
        }

        const target = new TestService(broker)

        const errorHooks = getServiceHooksError(target)

        expect(errorHooks).toEqual({
            greet: expect.arrayContaining([target.errorGreet, target.errorGreet2]),
        })
    })
})