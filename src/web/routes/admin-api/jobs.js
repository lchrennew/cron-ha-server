import { Controller } from "koa-es-template";

export default class Jobs extends Controller {

    constructor(config) {
        super(config);

        this.get('/', this.getJobs)
        this.post('/', this.createJob)
    }

    async getJobs(ctx) {

    }
}
