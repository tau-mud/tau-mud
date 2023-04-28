import "reflect-metadata";
import {Service as MoleculerService } from "moleculer";

export abstract class Service extends MoleculerService {
    abstract readonly name: string;
}


