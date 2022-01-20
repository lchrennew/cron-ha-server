export default class Consumer {
    constructor(username) {
        this.#username = username;
    }

    #username;

    get username() {
        return this.#username;
    }

    async getJobs() {
    }

    /**
     * create job
     * @param job {Job}
     * @return {Promise<void>}
     */
    async createJob(job) {
    }

    /**
     * update job
     * @param job {Job}
     * @return {Promise<void>}
     */
    async updateJob(job) {

    }
}
