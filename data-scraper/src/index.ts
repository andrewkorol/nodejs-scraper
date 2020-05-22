import "reflect-metadata";

import { DataStorage } from "./data-storage/data-storage";
import { Parser } from "./parser/parser";
import { SOURCES } from "./helpers/sources";

const dataStorage = new DataStorage();
const parser = new Parser();


parser.parse(SOURCES[2])
.then(async (res) => {

    dataStorage.updateOrInsertProduct(res)
        .catch((ex) => console.log(ex))
        .then(() => console.log(`done with ${SOURCES[2]}`))
})








