import { getApi, json, POST } from "./fetch.js";

const notifyApi = getApi(process.env.SOCKJS_BROKER_URL)
export const notify = async (event, job) => await notifyApi('publish/to_scheduler', POST, json({ event, job }))
