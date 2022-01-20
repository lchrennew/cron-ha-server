import cors from '@koa/cors'
import Koa from 'koa'
import koaBody from 'koa-body';
import compress from 'koa-compress'
import error from 'koa-error';
import requestLogger from './middlewares/requestLogger.js';
import responseTime from './middlewares/responseTime.js';
import IndexController from './routes/index.js'

export default function (config) {
    const app = new Koa()
    config.preHook?.(app)

    app
        .use(requestLogger(config))
        .use(cors({ credentials: true }))
        .use(compress())
        .use(responseTime(config))
        .use(koaBody())

    config.preRouterHook?.(app)

    app.use(new IndexController(config).routes())
    if (process.env.NODE_ENV !== 'production') {
        app.use(error());
    }
    return app

}
