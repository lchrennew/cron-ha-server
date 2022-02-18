import apiDef from './api-def.js';
import { Controller } from "koa-es-template";

export default class AdminApi extends Controller {
    constructor(config) {
        super(config);
        this.get('/', this.def)
    }

    def(ctx) {
        ctx.body = apiDef
    }
}
