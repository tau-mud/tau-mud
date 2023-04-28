import {action, ACTION_SCHEMA, getServiceActionSchema} from "./action";
import {Base} from "./Base";
import {ServiceBroker} from "moleculer";

describe("action", () => {
    it("should define metadata for action schema", () => {
        const broker = new ServiceBroker();

        const schema = {
            name: "foo",
            params: {
                name: "string",
                age: "number",
            }
        };

        class TestService extends Base {
            name = "test";

            @action(schema)
            greet() {}
        }

        const target = new TestService(broker)

        const serviceActionSchema = getServiceActionSchema(target)
        const actionSchema = serviceActionSchema.greet

        expect(actionSchema).not.toBeUndefined()
        expect(actionSchema).toEqual(expect.objectContaining({
            ...schema,
            name: "foo",
            handler: expect.any(Function),
        }))
    });

    it("should default the name if the name is not provided in the schema", () => {
        const broker = new ServiceBroker();

        const schema = {
            params: {
                name: "string",
                age: "number",
            }
        };

        class TestService extends Base {
            name = "test";

            @action(schema)
            greet() {}
        }

        const target = new TestService(broker)

        const serviceActionSchema = getServiceActionSchema(target)
        const actionSchema = serviceActionSchema.greet

        expect(actionSchema).not.toBeUndefined()
        expect(actionSchema).toEqual(expect.objectContaining({
            ...schema,
            name: "greet",
            handler: expect.any(Function),
        }))
    })
});
