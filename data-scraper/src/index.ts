import "reflect-metadata";

let logger = require('perfect-logger');

//container
import { appContainer } from "./container/inversify.container";

//interfaces
import { IStartup } from "./container/interfaces";

//helpers
import { TYPES } from "./container/inversify-helpers/TYPES";


logger.initialize('nodejs-parser', {
    logLevelFile: 0,
    logLevelConsole: 0,
    logDirectory: 'logs/',
    customBannerHeaders: 'Logs for nodejs-parser'
});

// App's start point
const startup = appContainer.get<IStartup>(TYPES.IStartup);
startup.start();

