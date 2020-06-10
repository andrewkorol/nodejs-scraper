import { Domain } from "../../entities";
import { Source } from "../../models/sources.model";

export interface IDomainTechnology {
    getDomainEntities(sources: Array<Source>): Promise<Array<Domain>> 
}
