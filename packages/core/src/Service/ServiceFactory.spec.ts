import {ServiceBroker} from "moleculer";
import {Service} from "./Service";
import {ServiceFactory} from "./ServiceFactory";
import {action} from "./action";

describe("ServiceFactory", () => {
    describe("with Tau Service", () => {
        it("should set the name", () => {
            const broker = new ServiceBroker();

            class TestService extends Service {
                name = "test";
            }

            const service = new ServiceFactory(broker, TestService);

            expect(service.name).toBe("test");
        });

        it("should set actions", () => {
            const broker = new ServiceBroker();

            class TestService extends Service {
                name = "test";

                @action()
                greet() {}
            }

            const service = new ServiceFactory(broker, TestService);
            const originalSchema = service.originalSchema

            expect(originalSchema.actions).toEqual({
                greet: {
                    name: "greet",
                    handler: expect.any(Function),
                }
            });
        })

    });
});
