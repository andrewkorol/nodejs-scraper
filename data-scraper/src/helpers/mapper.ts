import { Product } from '../entity/product-entity';
import { OpenGraphModel } from '../models/open-graph.model';

export class Mapper {
    public static customerToEntity(source: OpenGraphModel): Product {
        var entity = new Product();
     
        entity.id = source.ogUrl;
        entity.productImages = JSON.stringify(source.ogImage);
        entity.productDascription = source.ogDescription;
        entity.productName = source.ogTitle;
        entity.price = source.ogPriceAmount;
        entity.currency = source.ogPriceCurrency;

        return entity;
    }
}