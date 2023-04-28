import {ServiceBroker} from "moleculer";
import {Base} from "./Base";
import {ServiceFactory} from "./ServiceFactory";
import {action} from "./action";
import {Configure} from "../Configure";

describe("ServiceFactory", () => {
    describe("with Tau Service", () => {
        it("should set the name", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
                name = "test";
            }

            const service = new ServiceFactory(broker, TestService);

            expect(service.name).toBe("test");
        });

        it("should set actions", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
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

        it("should set methods", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
                name = "test";

                @action()
                greet() {}

                method() {}
            }

            const service = new ServiceFactory(broker, TestService);
            const originalSchema = service.originalSchema

            expect(originalSchema.methods).toEqual({
                method: expect.any(Function),
            });
        })


        it("assigns the created hook if it exists", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
                name = "test";

                created() {}
            }

            const service = new ServiceFactory(broker, TestService);
            const originalSchema = service.originalSchema

            expect(originalSchema.created).toEqual(TestService.prototype.created);
        })

        it("assigns the started hook if it exists", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
                name = "test";

                started() {}
            }

            const service = new ServiceFactory(broker, TestService);
            const originalSchema = service.originalSchema

            expect(originalSchema.started).toEqual(TestService.prototype.started);
        })

        it("assigns the stopped hook if it exists", () => {
            const broker = new ServiceBroker();

            class TestService extends Base {
                name = "test";

                stopped() {}
            }

            const service = new ServiceFactory(broker, TestService);
            const originalSchema = service.originalSchema

            expect(originalSchema.stopped).toEqual(TestService.prototype.stopped);
        })

        it("assigns settings from the Tau MUD engine settings `service` property if it exists", () => {
            const broker = new ServiceBroker(Configure("test", {
                settings: {
                    services: {
                        test: {
                            foo: "bar"
                        }
                    }
                }
            }))

            class TestService extends Base {
                name = "test";
            }

            const service = new ServiceFactory(broker, TestService);

            expect(service.settings).toEqual({
                foo: "bar"
            })
        })

        it("uses the service assigned settings as a default", () => {
            const broker = new ServiceBroker(Configure("test", {
                settings: {
                    services: {
                        test: {
                            foo: "bar"
                        }
                    }
                }
            }))

            class TestService extends Base {
                name = "test";

                settings = {
                    foo: "baz",
                    bar: "baz"
                }
            }

            const service = new ServiceFactory(broker, TestService);

            expect(service.settings).toEqual({
                foo: "baz",
                bar: "baz"
            })
        })

    });
});
