import { service } from "@tau-mud/core";

import {Portal} from "../../Portal/Portal";

class Telnet extends service.Base {
    mixins = [Portal];
}