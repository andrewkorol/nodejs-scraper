import "reflect-metadata";

//container
import { appContainer } from "./container/inversify.container";

//interfaces
import { IStartup } from "./container/interfaces";

//helpers
import { TYPES } from "./container/inversify-helpers/TYPES";

const startup = appContainer.get<IStartup>(TYPES.IStartup);
startup.start();

