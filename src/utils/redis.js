import { defaultLogProvider } from './logger.js';
import RedisURL from './redis-url.js';

const logger = defaultLogProvider('src/utils/redis.js')

/**
 *
 * @type {Redis}
 */
export const redis = new RedisURL().getRedis()
export const initRedis = async () => {
    if (redis) {
        await redis.set('ready', 'ready')
        logger.info(`Redis connection: ${await redis.get('ready')}`)
    }
}

export const hscanAll = async (key, { match, count }) => {
    let cursor = '0'
    const result = {}
    do {
        const [ nextCursor, values ] = await redis.hscan(key, cursor, ...(match ? [ 'MATCH', match ] : []), ...(count ? [ 'COUNT', count ] : []))
        cursor = nextCursor
        console.log(cursor)
        for (let i = 0; i < values.length; i++) {
            result[values[i]] = values[++i]
        }
    } while (cursor !== '0')
    return result
}
