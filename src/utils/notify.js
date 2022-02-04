import { getApi, json, POST } from "es-fetch-api";

const notifyApi = getApi(process.env.SOCKJS_BROKER_URL)
export const notify = async (event, job) => await notifyApi('publish/to_scheduler', POST, json({ event, job }))
