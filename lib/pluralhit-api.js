"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib");
class PluralhitApi {
    constructor(hostUrl = "") {
        this.CHANNEL_EMAILS = 'emails';
        if (typeof hostUrl !== 'string')
            hostUrl = "";
        hostUrl = hostUrl.trim();
        if (hostUrl === '')
            hostUrl = 'amqp://guest:guest@localhost:5672';
        this.hostUrl = hostUrl;
    }
    async send(em) {
        const conn = await amqp.connect(this.hostUrl);
        const channel = await conn.createChannel();
        const queue = this.CHANNEL_EMAILS;
        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(em)), {});
        await channel.close();
        await conn.close();
    }
}
exports.PluralhitApi = PluralhitApi;
