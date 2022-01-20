import StartTimeSpec from "./start-time-spec.js";
import parser from 'cron-parser'
import dayjs from "dayjs";

export default class Schedule {

    cron;
    /**
     * @type {StartTimeSpec}
     */
    startTime
    /**
     *
     * @type {dayjs.Dayjs}
     */
    endTime
    limit = 0
    skip = 0

    constructor(options = {
        cron: '* * * * * *',
        limit: 0,
        skip: 0,
        startTime: { time: dayjs().valueOf(), deferral: 0 },
    }) {
        const { cron, limit, skip, startTime, endTime, } = options
        this.cron = cron
        this.limit = limit
        this.skip = skip
        this.startTime = new StartTimeSpec({ ...startTime })
        this.endTime = endTime
    }

    /**
     *
     * @return {CronExpression}
     * @param currentTime {dayjs.Dayjs}
     */
    getInterval(currentTime = this.startTime?.actualTime ?? dayjs()) {
        return new parser.parseExpression(this.cron, {
            endDate: this.endTime?.toDate(),
            currentDate: currentTime?.toDate(),
        })
    }

    /**
     * 是否已经打烊（营业时间：actualStartTime -> endTime）
     * @param now {dayjs.Dayjs}
     */
    closed(now) {
        return now.isBefore(this.startTime.actualTime) && now.isAfter(this.endTime)
    }

}
