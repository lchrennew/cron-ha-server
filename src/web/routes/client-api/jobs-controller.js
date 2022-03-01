import Job from "../../../domain/job.js";
import Schedule from "../../../domain/schedule.js";
import WorkerSpec from "../../../domain/worker-spec.js";
import { repo } from "../../../repository/redis-repository.js";
import { redis } from "../../../utils/redis.js";
import dayjs from "dayjs";
import { notify } from "../../../utils/notify.js";
import { Controller } from "koa-es-template";
import { generateObjectID } from "es-object-id";

export default class JobsController extends Controller {

    constructor(config) {
        super(config);

        this.post('/', this.createJob)
        this.get('/', this.getJobs)
        this.post('/:key/bid', [
            this.getJob,
            this.jobIsStarted,
            this.jobNotEnded,
            this.jobNotExceededLimit,
            this.bidJob,
            this.increaseJobCount,
            this.emitWorkerJob,
        ])
        this.eventBus.on('job:obsolete', this.#obsoleteJob)
        this.eventBus.on('job:deleted', this.deleteJobKey)
        this.eventBus.on('job:deleted', this.notifySchedulers.bind(this))
        this.eventBus.on('job:updated', this.notifySchedulers.bind(this))
        this.eventBus.on('job:added', this.notifySchedulers.bind(this))
        this.get('/:key/count', this.getJobCount)
        this.put('/:key', this.updateJob)
        this.delete('/:key', this.deleteJob)
    }

    async createJob(ctx) {
        const { name, creator, schedule, worker } = ctx.request.body

        const job = new Job({
            key: generateObjectID(),
            name,
            creator,
            schedule: new Schedule(schedule),
            worker: new WorkerSpec(worker),
        })

        await repo.save(job.key, job)
        redis.sadd('{Jobs}:Active', job.key)
        this.eventBus.emit('job:added', job, 'added')
        ctx.body = { ok: true, data: job.data }
    }

    async getJobs(ctx) {
        const ids = await redis.smembers('{Jobs}:Active')
        ctx.body = { ok: true, data: await repo.gets(ids, Job) }
    }

    async getJob(ctx, next) {
        const { key } = ctx.params
        const jobData = await repo.get(key, Job)
        ctx.state.job = new Job(jobData)
        await next()
    }

    async jobIsStarted(ctx, next) {
        const { target } = ctx.request.body
        const now = dayjs(target)
        const { job } = ctx.state
        if (!job.notStarted(now)) return await next()
        ctx.status = 405
        ctx.body = { ok: false, data: 'Queueing', message: 'job is not started yet' }
    }

    async jobNotEnded(ctx, next) {
        const { target } = ctx.request.body
        const now = dayjs(target)

        /**
         * @type {Job}
         */
        const { job } = ctx.state
        if (!job.hasEnded(now)) return await next()
        this.eventBus.emit('job:obsolete', job.key)
        ctx.status = 405
        ctx.body = { ok: false, data: 'Obsolete', message: 'job has ended now' }
    }

    async jobNotExceededLimit(ctx, next) {
        const { key } = ctx.params
        const { job } = ctx.state
        const { limit } = job.schedule
        const count = job.limited ? (await redis.hget(`{Jobs}:RunCounter`, key) ?? 0) : 0
        ctx.state.count = count
        if (!job.hasLimit || count < limit) return await next()
        redis.smove('{Jobs}:Active', '{Jobs}:Obsolete', job.key)
        ctx.status = 405
        ctx.body = { ok: false, data: 'Obsolete', message: 'job reaches limit' }
    }

    async bidJob(ctx, next) {
        const { key } = ctx.params
        const { target } = ctx.request.body
        const bidden = await redis.sadd(`{JobRun}:${key}`, target)
        if (bidden) return await next()
        ctx.status = 405
        ctx.body = { ok: false, data: 'Failed', message: 'job is bidden by others' }
    }

    async increaseJobCount(ctx, next) {
        const { key } = ctx.params
        const { count, job } = ctx.state
        const { limit, skip } = job.schedule

        if (job.hasLimit && count < limit
            || !job.hasLimit && job.hasSkip && count < skip)
            redis.hincrby(`{Jobs}:RunCounter`, key, 1)

        await next()
    }

    async emitWorkerJob(ctx) {
        /**
         *
         * @type {Job}
         */
        const job = ctx.state.job
        job.worker.start()
        ctx.body = { ok: true, data: 'Success' }
    }

    async getJobCount(ctx) {
        const { key } = ctx.params
        const count = await redis.hget(`{Jobs}:RunCounter`, key) ?? 0
        ctx.body = { ok: true, data: count }
    }

    #obsoleteJob(jobKey) {
        redis.smove('{Jobs}:Active', '{Jobs}:Obsolete', jobKey)
    }

    async updateJob(ctx) {
        const { key } = ctx.params
        const job = await repo.get(key, Job)
        if (!job) {
            ctx.status = 404
            ctx.body = { ok: false, message: `job ${key} not found` }
            return
        }
        Object.assign(job, ctx.request.body, { key })
        await repo.save(key, job)
        this.eventBus.emit('job:updated', job, 'updated')
    }

    async deleteJob(ctx) {
        const { key } = ctx.params
        const job = await repo.get(key, Job)
        if (!job) {
            ctx.status = 404
            ctx.body = { ok: false, message: `job ${key} not found` }
            return
        }
        this.eventBus.emit('job:deleted', job, 'deleted')
        ctx.body = { ok: true, data: job }
    }

    notifySchedulers(job, event) {
        this.logger.info('Notify', event, job.key)
        notify(event, job).catch(error => this.logger.warn(`Failed notify:`, event, job.key, error.message ?? error))
    }

    deleteJobKey({ key }) {
        redis.smove('{Jobs}:Active', '{Jobs}:Deleted', key)
        redis.smove('{Jobs}:Obsolete', '{Jobs}:Deleted', key)
    }
}
