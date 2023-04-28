import { Configure, ITauOptions } from "./Configure";

import {ServiceFactory} from "../Service/ServiceFactory";

describe("Configure", () => {
    it("should append process ID to node ID when unique is false", () => {
        const nodeID = "test-node";
        const options: ITauOptions = {
            unique: false,
        };

        const result = Configure(nodeID, options);

        expect(result.nodeID).toMatch(`${nodeID}-${process.pid}`);
    });

    it("should not append process ID to node ID when unique is true", () => {
        const nodeID = "test-node";
        const options: ITauOptions = {
            unique: true,
        };

        const result = Configure(nodeID, options);

        expect(result.nodeID).toMatch(nodeID);
        expect(result.nodeID).not.toMatch(`${nodeID}-${process.pid}`);
    });

    it("should call created hooks for plugins", () => {
        const nodeID = "test-node";
        const pluginCreated = jest.fn();
        const options: ITauOptions = {
            plugins: [
                {
                    created: pluginCreated,
                },
            ],
        };
        const broker = {} as any;

        const created = Configure(nodeID, options).created as Function
        created(broker)

        expect(pluginCreated).toHaveBeenCalledWith(broker);
    });

    it("should call started hooks for plugins", () => {
        const nodeID = "test-node";
        const pluginStarted = jest.fn();
        const options: ITauOptions = {
            plugins: [
                {
                    started: pluginStarted,
                },
            ],
        };
        const broker = {} as any;

       const started = Configure(nodeID, options).started as Function

        started(broker);

        expect(pluginStarted).toHaveBeenCalledWith(broker);
    });

    it("should call stopped hooks for plugins", () => {
        const nodeID = "test-node";
        const pluginStopped = jest.fn();
        const options: ITauOptions = {
            plugins: [
                {
                    stopped: pluginStopped,
                },
            ],
        };
        const broker = {} as any;

        const stopped = Configure(nodeID, options).stopped as Function
        stopped(broker);

        expect(pluginStopped).toHaveBeenCalledWith(broker);
    });

    it("should correctly configure the ServiceFactory", () => {
        const nodeID = "test-node";
        const options: ITauOptions = {};
        const broker = {} as any;

        const result = Configure(nodeID, options).ServiceFactory

        expect(result).toEqual(ServiceFactory)
    })
});
