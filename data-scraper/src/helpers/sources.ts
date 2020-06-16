import { Source } from "../models/sources.model";

export const SOURCES: Array<Source> = [
    // { domainUrl: 'https://nonahandbags.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.aagestore.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://rixo.co.uk', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.belizeofficiel.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.janekoenig.com', productRegExp: '.*/product' },
    { domainUrl: 'https://safsafu.com', productRegExp: '.*/products'},
    { domainUrl: 'https://www.flattered.com/se/all-shoes/flats', productRegExp: '.*/all-shoes', coreLink: 'https://www.flattered.com' },
    // { domainUrl: 'https://scampi.se', productRegExp: '.*/produkter' },
    { domainUrl: 'https://www.gestuz.com', productRegExp: '.*' },
    { domainUrl: 'https://www.nanushka.com', productRegExp: '.*/product' }
]
