
export default config =>
    async (ctx, next) => {
        const start = process.hrtime();
        await next()
        let time = process.hrtime(start);
        // Format to high resolution actualTime with nano actualTime
        time = time[0] * 1000 + time[1] / 1000000;
        if (!config?.hrtime) {
            // truncate to milliseconds.
            time = Math.round(time);
        }
        ctx.set('X-Response-Time', `${time}ms`);
    }
