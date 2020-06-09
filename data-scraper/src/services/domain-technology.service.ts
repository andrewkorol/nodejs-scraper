import { injectable } from "inversify";
import { isNil } from "lodash";

const axios = require('axios');

import { Domain } from "../entities";
import { DomainTechnologyEnum } from "../helpers/domain-technology.enum"

@injectable()
export class DomainTechnology {
    public async getDomainEntities(sources: Array<string>): Promise<Array<Domain>> {
        let domains: Array<Domain> = new Array<Domain>()

        for (const source of sources) {
            let domain = new Domain();

            domain.id = source;

            const technology = await this.getDomainTechnology(domain.id);
            domain.technology = technology ? technology : DomainTechnologyEnum.OTHER;

            domains.push(domain);
        }

        return domains;
    }

    private async getDomainTechnology(source: string): Promise<DomainTechnologyEnum> {
        const res = await axios.get(source);

        if (res != null) {
            if (res.headers['x-shopify-stage']) {
                return DomainTechnologyEnum.SHOPIFY;
            }

            if (res.headers['x-wix-request-id']) {
                return DomainTechnologyEnum.WIX;
            }

            // if (res.body.includes('name="generator" content="WordPress')) {
            //     return 'WORDPRESS';
            // }

            if (!isNil(res.headers['x-pingback']) && res.headers['x-pingback'].includes('wp/xmlrpc')) {
                return DomainTechnologyEnum.WORDPRESS;
            }

            if (!isNil(res.headers['link']) && res.headers['link'].includes('https://api.w.org')) {
                return DomainTechnologyEnum.WORDPRESS;
            }
        }
    }
}