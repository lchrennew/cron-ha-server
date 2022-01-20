import { deserialize, fromFlatEntries, serialize } from '../utils/objects.js';
import { redis } from '../utils/redis.js';


export default class RedisRepository {

    // async exec(f) {
    //     return await f?.(redis)
    // }

    async insert(key, data) {
        const dataKey = `{${data.constructor.name}}:${key}`
        const exists = await redis.exists(dataKey)
        if (exists !== '0') return false
        await redis.hset(dataKey, serialize(data))
        return true
    }

    async save(key, data, prefix = '', Type = null) {
        const dataKey = `{${Type?.name ?? Type ?? data.constructor.name}}:${key}`
        const serialized = serialize(data, prefix)
        if (Object.keys(serialized).length) await redis.hset(dataKey, serialize(data, prefix))
    }

    async get(key, Type, prefix = '') {
        const dataKey = `{${Type.name ?? Type}}:${key}`
        if (prefix) return deserialize(fromFlatEntries((await redis.hscan(dataKey, 0, 'match', `${prefix}*`))[1]), prefix)
        return deserialize(await redis.hgetall(dataKey))
    }

    async gets(keys, Type) {
        return Promise.all(keys.map(key => this.get(key, Type)))
    }

    async delete(key, Type) {
        const dataKey = `{${Type?.name ?? Type ?? data.constructor.name}}:${key}`
        redis.del(dataKey)
    }
}

export const repo = new RedisRepository()
