import AdminApi from './admin-api/index.js';
import apiDef from './api-def.js';
import ClientApi from './client-api/index.js'
import Controller from './Controller.js';


export default class IndexController extends Controller {
    constructor(config) {
        super(config);
        this.get('/', this.def)

        this.use('/client-api', new ClientApi(config))
        this.use('/admin-api', new AdminApi(config))
    }

    async def(ctx) {
        ctx.body = apiDef
    }
}
