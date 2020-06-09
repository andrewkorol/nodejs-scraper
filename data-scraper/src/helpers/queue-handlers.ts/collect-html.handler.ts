import { appContainer } from "../../container/inversify.container";
import { IDataStorage } from "../../container/interfaces";
import { TYPES } from "../../container/inversify-helpers/TYPES";

const axios = require('axios');


export async function collectHtml(link: string) {
    const res = await axios.get(link);

    const dataStorage = appContainer.get<IDataStorage>(TYPES.IDataStorage);
    dataStorage.updateDomainLink(link, res.data);
}
