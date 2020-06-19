import { inject, injectable } from "inversify";

import { IDataStorage } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/types";
import { IStatistics } from "../container/interfaces/statistics.interfase";

@injectable()
export class Statistics implements IStatistics {
    private _dataStorage: IDataStorage;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage) {
        this._dataStorage = dataStorage;
    }

    public async calculate() {
        const links = await this._dataStorage.getAllLinksWithProducts();

        if (!links) {
            return;
        }

        const totalFieldsCount = Object.keys(links[0].product).length;

        for (const link of links) {
            let notNullCount = 0;

            if (link.product) {
                for (let [key, value] of Object.entries(link.product)) {
        

                    if (value) {
                        if(key === 'breadcrumps') {
                            console.log(key, value);
    
                        }
                        notNullCount++;
                    }
                }
            }

            console.log(notNullCount, totalFieldsCount);

            link.staistic = notNullCount / totalFieldsCount * 100;
            console.log(link.staistic);
        }

        this._dataStorage.updateLinks(links)
    }
}