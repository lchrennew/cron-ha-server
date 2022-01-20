import Router from '@koa/router'

/**
 * Base class for Controllers to standardize binding to express Router.
 */
class Controller {
    logger
    router;
    /**
     * @type {EventEmitter}
     */
    eventBus;

    constructor(config) {
        this.router = new Router().prefix(config.baseUriPath)
        this.config = config;
        this.logger = config.getLogger(this.constructor.name)
        this.eventBus = config.eventBus
    }

    get(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.get(
            path,
            ...handler
        );
    }

    post(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.post(
            path,
            ...handler
        );
    }

    put(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.put(
            path,
            ...handler,
        );
    }

    delete(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.delete(
            path,
            ...handler,
        );
    }

    patch(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.patch(
            path,
            ...handler,
        );
    }

    upload(path, filehandler, handler) {
        this.router.post(
            path,
            filehandler,
            handler.bind(this),
        );
    }

    use(path, controller) {
        this.router.use(path, controller.routes())
    }

    routes() {
        return this.router.routes()
    }
}

export default Controller;
