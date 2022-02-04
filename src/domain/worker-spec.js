import { getApi, json, POST } from "es-fetch-api";

export default class WorkerSpec {
    /**
     * @type {string}
     */
    url
    /**
     *
     * @type {{}}
     */
    data = {}

    /**
     * @param {string} url
     * @param {{}} data
     */
    constructor({ url, data }) {
        this.data = data;
        this.url = url
    }

    async start(){
        const api = getApi(this.url)
        await api(POST, json(this.data)).catch(()=>null)
    }
}
