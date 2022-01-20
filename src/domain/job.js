import { generateObjectID } from "../utils/oid.js";
import Schedule from "./schedule.js";
import WorkerSpec from "./worker-spec.js";

export default class Job {
    name
    creator;
    /**
     * @type {WorkerSpec}
     */
    worker;
    key;
    /**
     * @type {Schedule}
     */
    schedule;
    cron

    constructor({ key = generateObjectID(), name, creator, schedule, worker }) {
        this.key = key;
        this.schedule = new Schedule(schedule);
        this.worker = new WorkerSpec(worker);
        this.name = name
        this.creator = creator
    }

    get actualStartTime() {
        return this.schedule.startTime.actualTime
    }

    get limited() {
        return this.hasLimit || this.hasSkip
    }

    get hasSkip() {
        return this.schedule.skip > 0;
    }

    get hasLimit() {
        return this.schedule.limit > 0;
    }

    notStarted(now) {
        return now.isBefore(this.actualStartTime)
    }

    hasEnded(now) {
        return this.schedule.endTime && now.isAfter(this.schedule.endTime)
    }
}
