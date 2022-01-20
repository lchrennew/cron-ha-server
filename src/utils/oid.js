/**
 * Machine id.
 *
 * Create a random 3-byte value (i.e. unique for this
 * process). Other drivers use a md5 of the machine id here, but
 * that would mean an asyc call to gethostname, so we don't bother.
 * @ignore
 */
const MACHINE_ID = parseInt(`${Math.random() * 0xffffff}`, 10);
let index = ~~(Math.random() * 0xffffff)
const getInc = () => (++index) % 0xffffff
export const parseObjectID = str => {
    const timestamp = parseInt(str.substr(0, 8), 16) * 1000
    const machine = parseInt(str.substr(8, 6), 16)
    const pid = parseInt(str.substr(14, 4), 16)
    const inc = parseInt(str.substr(18), 16)
    return {timestamp, machine, pid, inc}
}
export const generateObjectID = (time) => {
    const timestamp = time ?? ~~(Date.now() / 1000)
    const pid = (Math.floor(Math.random() * 100000)) % 0xffff
    const inc = getInc()
    return [timestamp.toString(16).padStart(8, '0'), MACHINE_ID.toString(16).padStart(6, '0'), pid.toString(16).padStart(4, '0'), inc.toString(16).padStart(6, '0')].join('')
}
