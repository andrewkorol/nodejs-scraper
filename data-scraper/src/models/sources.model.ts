export interface Source {
    domainUrl: string;
    productRegExp: string;
    coreLink?: string;
    selectors?: Selectors;
}

export interface Selectors {
    images?: FieldSelector;
    description?: FieldSelector;
    name?: FieldSelector;
    available?: FieldSelector;
    options?: FieldSelector;
    brand?: FieldSelector;
    price?: FieldSelector;
    currency?: FieldSelector;
    tags?: FieldSelector;
}

export interface FieldSelector {
    identifier: string;
    methods: Array<Method>;
}

interface Method {
    name: string;
    parameters?: string;
}