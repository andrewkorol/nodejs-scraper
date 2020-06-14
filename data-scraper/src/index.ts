import "reflect-metadata";

let logger = require('perfect-logger');

//container
import { appContainer } from "./container/inversify.container";

//interfaces
import { IStartup } from "./container/interfaces";

//helpers
import { TYPES } from "./container/inversify-helpers/TYPES";


logger.initialize('nodejs-parser', {
    logLevelFile: 0,                    // Log level for file
    logLevelConsole: 0,                 // Log level for STDOUT/STDERR
    logDirectory: 'logs/',              // Log directory
    customBannerHeaders: 'Logs for nodejs-parser'  // Custom Log Banner
});

const startup = appContainer.get<IStartup>(TYPES.IStartup);
startup.start();

