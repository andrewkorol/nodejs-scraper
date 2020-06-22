import { inject, injectable } from "inversify";
import { groupBy } from "lodash";

import { IDataStorage } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/TYPES";
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
                        notNullCount++;
                    }
                }
            }

            link.staistic = notNullCount / totalFieldsCount * 100;
        }

        await this._dataStorage.updateLinks(links)

        const domains = await this._dataStorage.getDomains();

        for (const domain of domains) {
            const statistics = domain.links.map(link => link.staistic);

            domain.staistic = statistics.reduce((a, b) => a + b, 0) / statistics.length;
        }

        this._dataStorage.updateDomains(domains);
    }
}