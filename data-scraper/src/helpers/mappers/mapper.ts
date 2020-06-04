import { Product } from '../../entities/product-entity';
import { OpenGraphModel } from '../../models/open-graph.model';
import { Domain } from '../../entities/domain-entity';
import { Link } from '../../entities/link-entity';

export class Mapper {
    public static OGModelToEntity(source: OpenGraphModel): Product {
        var entity = new Product();
     
        entity.id = source.ogUrl;
        entity.productImages = JSON.stringify(source.ogImage);
        entity.productDascription = source.ogDescription;
        entity.productName = source.ogTitle;
        entity.price = source.ogPriceAmount;
        entity.currency = source.ogPriceCurrency;

        return entity;
    }

    public static domainListToEntity(sources: string[]): Domain[] {
        let domains: Array<Domain> = new Array();

        sources.forEach((source) => {
            var entity = new Domain();
            entity.id = source;

            domains.push(entity);
        })

        return domains;
    }

    public static sitemapUrlsToEntity(sources: string[], domain: string): Link[] {
        let links: Array<Link> = new Array();

        sources.forEach((source) => {
            var entity = new Link();
            entity.id = source;

            links.push(entity);
        })

        return links;
    }
}