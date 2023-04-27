import { Configure } from "@tau-mud/core";
import { Plugin as PortalPlugin } from "@tau-mud/portal"

import base from "./base.config"

export default Configure("portal", {
    unique: true,
    plugins: [
        PortalPlugin
    ],
    ...base
})