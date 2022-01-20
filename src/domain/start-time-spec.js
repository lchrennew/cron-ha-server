import dayjs from "dayjs";

export default class StartTimeSpec {
    deferral
    time

    constructor({ time = dayjs().valueOf(), deferral = 0 }) {
        this.time = time
        this.deferral = deferral
    }

    /**
     *
     * @return {dayjs.Dayjs}
     */
    get actualTime() {
        return dayjs(this.time).add(this.deferral);
    }
}
