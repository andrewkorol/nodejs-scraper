import { Product } from '../../entities/product-entity';
import { OpenGraphModel } from '../../models/open-graph.model';
import { Domain } from '../../entities/domain-entity';
import { Link } from '../../entities/link-entity';

export class Mapper {
    public static OGModelToEntity(source: OpenGraphModel, outEntity: Product): void {
        outEntity.brand = source.site_name;
        outEntity.id = source.url;
        // outEntity.productImages = JSON.stringify(source.image);
        outEntity.description = source.description;
        outEntity.name = source.title;
        outEntity.price = source.price.amount;
        outEntity.currency = source.price.currency;
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
