import StartTimeSpec from "./start-time-spec.js";
import dayjs from "dayjs";

const startTime = dayjs('2000-1-1 00:00:00').valueOf()

test('default should be no deferral', () => {
    const startTimeSpec = new StartTimeSpec({ time: startTime.valueOf() })
    expect(startTimeSpec.actualTime.isSame(startTime))

})

test('defer 10s', () => {
    const startTimeSpec = new StartTimeSpec({ time: startTime, deferral: 10000 })
    expect(startTimeSpec.actualTime.isAfter(startTime)).toBeTruthy()
    expect(startTimeSpec.actualTime.diff(startTime, 'ms')).toBe(10000)
})

test('defer -10s', () => {
    const startTimeSpec = new StartTimeSpec({ time: startTime, deferral: -10000 })
    expect(startTimeSpec.actualTime.isBefore(startTime)).toBeTruthy()
    expect(startTimeSpec.actualTime.diff(startTime, 'ms')).toBe(-10000)
})
