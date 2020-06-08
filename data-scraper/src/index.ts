import "reflect-metadata";

import { appContainer } from "./container/inversify.container";

import { Parser } from "./core/parser/parser";
import { SOURCES } from "./helpers/sources";
import { IDomainCrawl } from "./container/interfaces";
import { TYPES } from "./container/inversify-helpers/TYPES";


const domainCrawl = appContainer.get<IDomainCrawl>(TYPES.IDomainCrawl);
// domainCrawl.crawl()
//     .catch((reason) => console.log(reason))
//     .then(() => { })

// const parser = new Parser();
// parser.parse(SOURCES[0])
//     .then(async (res) => {

//         dataStorage.updateOrInsertProduct(res)
//             .catch((ex) => console.log(ex))
//             .then(() => console.log(`done with ${SOURCES[0]}`))
//     })

var amqp = require('amqplib');

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

// var connectionListen = amqp.createConnection(opt);

// // add this for better debuging
// connectionListen.on('error', function (e) {
//     console.log("Error from amqp: ", e);
// });

// var _queue = null;
// var _consumerTag = null;

// connectionListen.on('tag.change', function (event) {
//     if (_consumerTag === event.oldConsumerTag) {
//         _consumerTag = event.consumerTag;
//         // Consider unsubscribing from the old tag just in case it lingers
//         _queue.unsubscribe(event.oldConsumerTag);
//     }
// });

// // Initialize the exchange, queue and subscription
// connectionListen.on('ready', function () {

//     connectionListen.queue('my-queue', function (queue) {
//         _queue = queue;

//         // Subscribe to the queue
//         queue
//             .subscribe(function (message) {
//                 // Handle message here
//                 console.log('before message')
//                 console.log('Got message', message.toString());
//                 queue.shift(false, false);
//             })
//             .addCallback(function (res) {
//                 // Hold on to the consumer tag so we can unsubscribe later
//                 _consumerTag = res.consumerTag;
//             })
//             ;
//     });

// });

// const connectionProduser = amqp.createConnection(opt);

// connectionProduser.on('ready', function () {
//     let msg = 'Test message';
//     connectionProduser.publish('my-queue', Buffer.from(msg), {
//         persistent: false
//       }, function(res) {
//           console.log('works here');
//         console.log(res);
//       })

// });

// // Some time in the future, you'll want to unsubscribe or shutdown 
// setTimeout(function () {
//     if (_queue) {
//         _queue
//             .unsubscribe(_consumerTag)
//             .addCallback(function () {
//                 // unsubscribed
//             })
//             ;
//     } else {
//         // unsubscribed
//     }
// }, 60000);
