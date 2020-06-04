import "reflect-metadata";

import { appContainer } from "./container/inversify.container";

import { Parser } from "./core/parser/parser";
import { SOURCES } from "./helpers/sources";
import { IDomainCrawl } from "./container/interfaces";
import { TYPES } from "./container/inversify-helpers/TYPES";


const domainCrawl = appContainer.get<IDomainCrawl>(TYPES.IDomainCrawl);
domainCrawl.crawl()
    .catch((reason) => console.log(reason))
    .then(() => { })

// const parser = new Parser();
// parser.parse(SOURCES[0])
//     .then(async (res) => {

//         dataStorage.updateOrInsertProduct(res)
//             .catch((ex) => console.log(ex))
//             .then(() => console.log(`done with ${SOURCES[0]}`))
//     })
