import "reflect-metadata";
var amqp = require('amqplib');

import { appContainer } from "./container/inversify.container";

import { Parser } from "./core/parser/parser";
import { SOURCES } from "./helpers/sources";
import { IDomainCrawl } from "./container/interfaces";
import { TYPES } from "./container/inversify-helpers/TYPES";


const domainCrawl = appContainer.get<IDomainCrawl>(TYPES.IDomainCrawl);

// const parser = new Parser();
// parser.parse(SOURCES[0])
//     .then(async (res) => {

//         dataStorage.updateOrInsertProduct(res)
//             .catch((ex) => console.log(ex))
//             .then(() => console.log(`done with ${SOURCES[0]}`))
//     })


const opt = {
    protocol: 'amqp',
    hostname: 'rabbit.twopointzero.eu',
    port: 5672,
    username: 'andrewkorol',
    password: 'W#&nfR9$',
    vhost: 'scraper',
}

var open = amqp.connect(opt);

const q = 'queue';

open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(q).then(async function (ok) {
        const messages = await domainCrawl.getDomains();

        messages.forEach((link) => {
            return ch.sendToQueue(q, Buffer.from(link.id));
        })
    });
}).catch(console.warn);

open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(q).then(function (ok) {
        return ch.consume(q, async function (msg) {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                console.log(messageContent);
                await domainCrawl.crawlByUrl(messageContent);
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);
