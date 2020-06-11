export interface OpenGraphModel {
    site_name: string;
    url: string;
    title: string;
    type: string;
    description: string;
    price: OpenGraphPrice;
    image: any;
} 

interface OpenGraphPrice {
    amount: string;
    currency: string;
}
