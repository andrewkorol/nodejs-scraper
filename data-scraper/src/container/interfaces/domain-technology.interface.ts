import { Domain } from "../../entities";

export interface IDomainTechnology {
    getDomainEntities(sources: Array<string>): Promise<Array<Domain>> 
}
