import Schedule from "./schedule.js";
import dayjs from "dayjs";
import StartTimeSpec from "./start-time-spec.js";

const now = dayjs('2000-1-1 0:0:0')
const time = dayjs('2020-1-1 0:0:0')

test('default schedule', () => {
    const startTime = new StartTimeSpec({ time })
    const schedule = new Schedule({ startTime })
    const interval = schedule.getInterval(now)
    expect(dayjs(interval.next()).isSame(now.add(1, 'second'))).toBeTruthy()
})

test('倒计时 10s', () => {
    const startTime = new StartTimeSpec({ time, deferral: 10000 })
    const schedule = new Schedule({ startTime })
    const interval = schedule.getInterval()
    expect(dayjs(interval.next()).format()).toBe(time.add(10000).add(1, 'second').format())
})
