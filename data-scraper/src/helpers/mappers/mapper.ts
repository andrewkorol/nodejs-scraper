import { Product } from '../../entities/product-entity';
import { OpenGraphModel } from '../../models/open-graph.model';
import { Domain } from '../../entities/domain-entity';
import { Link } from '../../entities/link-entity';
import { Selectors } from '../../models/sources.model';
import { Selector, Image } from '../../entities';

var md5 = require('md5');

export class Mapper {
    public static OGModelToEntity(source: OpenGraphModel, outEntity): void {
        outEntity.brand = source.site_name;
        // outEntity.id = source.url;
        // outEntity.images.push(...source.image);
        outEntity.description = source.description;
        outEntity.name = source.title;
        if(!source.price) {
            return;
        }

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

    public static selectorToEntity(selectors: Selectors) {
        const selector = new Selector();

        selector.name = JSON.stringify(selectors.name);
        selector.available = JSON.stringify(selectors.available);
        selector.brand = JSON.stringify(selectors.brand);
        selector.currency = JSON.stringify(selectors.currency);
        selector.description = JSON.stringify(selectors.description);
        selector.images = JSON.stringify(selectors.images);
        selector.options = JSON.stringify(selectors.options);
        selector.price = JSON.stringify(selectors.price);
        selector.tags = JSON.stringify(selectors.tags);
        selector.breadcrumps = JSON.stringify(selectors.breadcrumps);

        return selector;
    }

    public static productImagesToEntity(images: string[]): Array<Image> {
        let imagesEntities: Array<Image> = new Array<Image>();
        console.log(images);

        images.forEach((image) => {
            if(!image.length) {
                return;
            }

            let imageEntity: Image = new Image();

            imageEntity.id = md5(image);
            imageEntity.externalUrl = image;
            imageEntity.productShot = false;
            imageEntity.updated = Date.now().toString();

            imagesEntities.push(imageEntity);
        })

        return imagesEntities;
    }
}
