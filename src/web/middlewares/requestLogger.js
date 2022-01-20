export default config => {
    const logger = config.getLogger('HTTP');
    return async (ctx, next) => {
        await next();
        if (ctx.method !== 'OPTIONS')
            logger.info(`${ctx.status} ${ctx.response.headers['x-response-time']} ${ctx.method} ${ctx.path}`);
    };
}
