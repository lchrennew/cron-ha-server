import Controller from '../Controller.js';
import apiDef from './api-def.js';
import JobsController from "./jobs-controller.js";

export default class ClientApi extends Controller {
    constructor(config) {
        super(config);
        this.get('/', this.def)
        this.use('/jobs', new JobsController(config))
    }

    def(ctx) {
        ctx.body = apiDef
    }
}
