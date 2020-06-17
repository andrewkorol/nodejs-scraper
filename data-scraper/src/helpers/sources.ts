import { Source } from "../models/sources.model";

export const SOURCES: Array<Source> = [
    // { domainUrl: 'https://nonahandbags.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.aagestore.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://rixo.co.uk', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.belizeofficiel.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.janekoenig.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://safsafu.com', productRegExp: '.*/products'},
    // { domainUrl: 'https://www.flattered.com/se/all-shoes/flats', productRegExp: '.*/all-shoes', coreLink: 'https://www.flattered.com' },
    // { domainUrl: 'https://scampi.se', productRegExp: '.*/produkter' },
    // { domainUrl: 'https://www.gestuz.com', productRegExp: '.*' },
    // { domainUrl: 'https://www.nanushka.com', productRegExp: '.*/product' }
    {
        domainUrl: 'https://www.4254sport.com', productRegExp: '.*/product', selectors: {
            price: {
                identifier: '.product__price',
                methods: [{ name: 'first' }, { name: 'text' }, { name: 'trim' }]
            }
        }
    },
    { domainUrl: 'https://www.aagestore.com', productRegExp: '.*/product' },
    {
        domainUrl: 'https://www.aperfectnomad.com', productRegExp: '.*/shop', selectors: {
            currency: {
                identifier: '.sqs-money-native',
                methods: [{ name: 'before' }, { name: 'text' }]
            },
            options: {
                identifier: '.variant-select-wrapper',
                methods: [{ name: 'first' }, { name: 'children' }, { name: 'first' }, { name: 'find', parameters: 'option'} ]
            }
        }
    },
    // { domainUrl: 'https://www.belizeofficiel.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.betolazastudio.com', productRegExp: '.*/store' },
    // { domainUrl: 'https://www.bertacabestany.com', productRegExp: '.*/shop' },
    // { domainUrl: 'https://birrot.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://byvarga.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://charli-cohen.com', productRegExp: '.*/product' },
    // { domainUrl: 'https://www.cloecassandro.com', productRegExp: '.*/product' }

]
