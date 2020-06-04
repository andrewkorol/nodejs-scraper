import "reflect-metadata";

import { DataStorage } from "./data-storage/data-storage";
import { Parser } from "./core/parser/parser";
import { SOURCES } from "./helpers/sources";
import { DomainCrawl } from "./core/domain-croul/domain-crawl";
import { Domain } from "./entities/domain-entity";
import { Link } from "./entities/link-entity";

const dataStorage = new DataStorage();
dataStorage.updateDomains(SOURCES);
dataStorage.getDomains()
    .then((domains: Domain[]) => {
        const domainCrawl = new DomainCrawl();
        domainCrawl.crawl(domains[0].id)
            .then((linksAsEntities: Link[]) => {
                console.log(linksAsEntities);

            })
    })

const parser = new Parser();

parser.parse(SOURCES[0])
    .then(async (res) => {

        dataStorage.updateOrInsertProduct(res)
            .catch((ex) => console.log(ex))
            .then(() => console.log(`done with ${SOURCES[0]}`))
    })








