import { Mapper } from "../../helpers/mappers/mapper";
import { isEmpty } from "lodash"
import { FieldSelector } from "../../models/sources.model";

const cheerio = require('cheerio');
const microdata = require('microdata-node');
const md5 = require('md5');
const { parse } = require('parse-open-graph')

export class ScrapeHtml {
    private data;
    private product;

    constructor(doc) {
        var date = new Date();
        date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];

        this.data = doc;
        this.data.html = new Buffer(this.data.html).toString();
        this.product = {
            id: this.data.id,
            images: [],
            brand: '',
            name: null,
            description: null,
            options: [],
            price: 0,
            currency: null,
            available: false,
            tags: ['product'],
            public: false,
        }
    }

    cleanString(input) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    }

    cleanImageUrl(url) {
        if (!url) {
            return;
        }
        // console.log('cleaning ' + url);
        const regexMag = /\/cache\/[0-9]\/(thumbnail\/\d{2,4}[x]\d{2,4}|small_image\/\d{2,4}[x]\d{2,4}|image\/\d{2,4}[x]\d{2,4}|image)\/[a-z 0-9]*/gi;
        url = url.replace(regexMag, '');
        const regexMag2 = /(\/cache\/[a-z 0-9]+)(\/[a-z 0-9]{1}\/[a-z 0-9]{1})/gi;
        url = url.replace(regexMag2, '$2');
        const regexMin = /-min-\d*x\d*/gi;
        url = url.replace(regexMin, '');
        const regexShopify = /_\d*x\d*/gi;
        url = url.replace(regexShopify, '');
        const regexWix = /\/v1\/.*/gi;
        url = url.replace(regexWix, '');
        const regexWoo = /-\d*x\d*/gi;
        url = url.replace(regexWoo, '');
        //console.log('cleaned: ' + url);
        url = url.replace('/thumbnails/500/500', '/thumbnails/1500/1500');
        return 'https:' + url.split('?v=')[0].replace('https:', '').replace('http:', '');
    }

    cleanAmount(strg) {
        var strg = strg || "";
        var decimal = '.';
        strg = strg.replace(/[^0-9$.,]/g, '');
        if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
        if ((strg.match(new RegExp("\\" + decimal, "g")) || []).length > 1) decimal = "";
        if (decimal != "" && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf("0" + decimal) !== 0) decimal = "";
        strg = strg.replace(new RegExp("[^0-9$" + decimal + "]", "g"), "");
        strg = strg.replace(',', '.');
        return parseFloat(strg);
    }

    cleanCurrency(strg) {
        var currency = "";
        var output = "";
        console.log('===currency===');
        console.log(strg);
        console.log('===currency===');
        if (strg != null) {
            strg = strg.toLowerCase();
            if (strg.includes('pound') || strg.includes('£')) {
                output = 'GBP';
            }
            if (strg.includes('euro') || strg.includes('€')) {
                output = 'EUR';
            }
            if (strg.includes('dkk')) {
                output = 'DKK';
            }
        }
        return output;
    }

    getMetaContent = function ($, field) {
        //<meta name="description" content="People by Repose AMS is de hoogzomer collectie van het prachtige Amsterdamse merk Repose AMS. De collectie bestaat uit kwaliteitsvolle en tijdloze stuks voor trendy jongens en meisjes van 2-14j. Ontdek deze zachte kindercollectie online bij Goldfish.be" />
        var output = '';
        var ogNode = $('[property=\'og:' + field + '\']');
        if (ogNode.length == 1 && ogNode[0].attribs.content.length > 5) {
            output = ogNode[0].attribs.content;
        }
        var metaNode = $('[name=\'' + field + '\']');
        if (metaNode.length == 1 && metaNode[0].attribs.content.length > output.length) {
            output = metaNode[0].attribs.content;
        }
        return output;
    }



    getProduct() {
        if (this.data.json != null && false) {
            var json = JSON.parse(this.data.json);
            this.product.tags = json.product.tags;
            this.product.name = json.product.title;
            this.product.description = json.product.body_html;

            if ((json.product.options[0].name).toLowerCase() == 'size') {
                this.product.options = json.product.options[0].values;
            }
            if (json.product.variants[0].price) {
                this.product.price = json.product.variants[0].price;
                this.product.currency = 'UNKNOWN';
            }

            this.product.url = 'https://' + this.data.domain + this.data.path;
            var list_images = [];
            if (json.product.images.length > 0) {
                for (const img of json.product.images) {
                    list_images.push(this.cleanImageUrl(img.src));
                }
                this.product.images = JSON.stringify(Array.from(new Set(list_images)));
            }
            return this.product;
        } else {
            if (this.data.html != null) {
                const $ = cheerio.load(JSON.parse(this.data.html));

                const meta = $('meta[property]').map((i, el) => ({
                    property: $(el).attr('property'),
                    content: $(el).attr('content')
                })).get()

                const result = parse(meta);

                if (result) {
                    Mapper.OGModelToEntity(result.og, this.product);
                }


                const micro = microdata.toJson(this.data.html, { base: 'http://www.example.com' });

                for (var i = 0; i < micro.items.length; i++) {
                    if (micro.items[i].type && micro.items[i].type[0] == "http://schema.org/Product") {
                        console.log("found this.product micro items in the body ...");

                        // Check title
                        if (micro.items[i].properties.name) {
                            this.product.name = micro.items[i].properties.name[0];
                        }

                        // Check description
                        if (micro.items[i].properties.description) {
                            this.product.description = micro.items[i].properties.description[0];
                        }

                        try {
                            // Check for images
                            if (micro.items[i].properties.image) {
                                for (var img = 0; img < micro.items[i].properties.image.length; img++) {
                                    if (micro.items[i].properties.image[img].startsWith("//"))
                                        micro.items[i].properties.image[img] = 'https:' + micro.items[i].properties.image[img];
                                    this.product.images.push(micro.items[i].properties.image[img]);
                                }
                            }
                        } catch (error) {

                        }


                        // Check for offers
                        if (micro.items[i].properties.offers) {
                            for (var offers = 0; offers < micro.items[i].properties.offers.length; offers++) {
                                var offer = micro.items[i].properties.offers[offers];

                                if (offer.properties.price) {
                                    this.product.price = this.cleanAmount(offer.properties.price[0]);
                                }
                                if (offer.properties.priceCurrency) {
                                    this.product.currency = this.cleanCurrency(offer.properties.priceCurrency[0]);
                                }

                                if (offer.properties.availability) {
                                    this.product.available = offer.properties.availability[0].includes('InStock');
                                }
                            }
                        }
                    }
                }

                try {

                    var images = $('meta[property=\'og:image\']');
                    for (var i = 0; i < images.length; i++) {
                        if (images[i].attribs != null && images[i].attribs.content != null) {
                            this.product.images.push(this.cleanImageUrl(url.toString()));
                        }
                    }

                } catch (error) {

                }

                try {

                    var images = $('meta[property=\'og:image:secure_url\']');
                    for (var i = 0; i < images.length; i++) {
                        if (images[i].attribs != null && images[i].attribs.content != null) {
                            //var url = new URL(images[i].attribs.content);

                            this.product.images.push(images[i].attribs.content);
                        }
                    }

                } catch (error) {

                }

                try {
                    var images = $('img[data-large_image]');
                    for (var i = 0; i < images.length; i++) {
                        //console.log(images[i].attribs);
                        var urlRaw = images[i].attribs['data-large_image'];
                        //if (urlRaw.startsWith("//"))
                        //    urlRaw = 'https:' + urlRaw;
                        //var url = new URL(urlRaw);
                        //url.protocol = 'https';
                        //url.searchParams.delete('v');
                        this.product.images.push(urlRaw);
                    }

                } catch (error) {

                }

                //if(this.product.images.length == 0){
                if ($('img.gallery-image').length > 0) { //Could be good for magento sites
                    var images = $('img.gallery-image');
                    for (var i = 0; i < images.length; i++) {
                        var urlRaw = images[i].attribs['src'];
                        this.product.images.push(urlRaw);
                    }
                }
                //}

                //if(this.product.images.length == 0){
                if ($('meta[property=\'og:image\']').length > 0) { //Could be good for magento sites
                    var images = $('meta[property=\'og:image\']');
                    for (var i = 0; i < images.length; i++) {
                        var urlRaw = images[i].attribs['content'];
                        this.product.images.push(urlRaw);
                    }
                }
                //}

                //if(this.product.images.length == 0){
                //class="attachment-extra_large size-extra_large wp-post-image"
                if ($('.size-extra_large').length > 0) { //Could be good for magento sites
                    var images = $('.size-extra_large');
                    for (var i = 0; i < images.length; i++) {
                        var urlRaw = images[i].attribs['src'];
                        this.product.images.push(urlRaw);
                    }
                }
                //}

                //if(this.product.images.length == 0){
                //class="attachment-extra_large size-extra_large wp-post-image"
                if ($('.venobox').length > 0) { //Could be good for magento sites
                    var images = $('.venobox');
                    for (var i = 0; i < images.length; i++) {
                        var urlRaw = images[i].attribs['href'];
                        this.product.images.push(urlRaw);
                    }
                }

                if ($('.c-sticky-image').length > 0) {
                    var images = $('.c-sticky-image');
                    for (var i = 0; i < images.length; i++) {
                        var urlRaw = images[i].attribs['src'];
                        this.product.images.push(urlRaw);
                    }
                }
                //}            


                this.product.images = this.product.images.map(url => this.cleanImageUrl(url));

                this.product.images = Array.from(new Set(this.product.images));

                var canonical = $('[rel=\'canonical\']');
                this.product.canonicalId = canonical.length == 1 ? canonical[0].attribs.href : null;
                this.product.canonicalId = canonical.length == 1 ? canonical[0].attribs.href : null;

                var url = $('meta[property=\'og:url\']');

                if (this.product.canonicalId == null && url != null && url[0] != null) {
                    this.product.canonicalId = url[0].attribs.content;
                }

                if (this.product.canonicalId == null || this.product.canonicalId == undefined) {
                    this.product.canonicalId = this.data.url;
                }

                //console.log(this.data.url);

                //this.product.id = md5(this.product.url);

                var options = $('[data-option]');

                var loadOptionsViaHtml = false
                for (var i = 0; i < options.length; i++) {
                    if (options[i].attribs.value) {
                        this.product.options.push(options[i].attribs.value);
                    } else {
                        loadOptionsViaHtml = true;
                    }
                }

                if (loadOptionsViaHtml) {
                    var optionsText = $('[data-option]').text() + '/' + $("[id^=SingleOptionSelector]").text();

                    this.product.options = Array.from(new Set(optionsText.replace(/\s+/g, '/').split('/')));
                }

                if (this.product.options.length == 0) {
                    var optionsText: string = $('[data-value]').text();
                    this.product.options = Array.from(new Set(optionsText.replace(/\s+/g, '/').split('/')));

                }

                var priceAmountOg = $('[property=\'og:price:amount\']');
                if (priceAmountOg.length == 1) {
                    var priceString = priceAmountOg[0].attribs.content;
                    this.product.price = this.cleanAmount(priceString);

                }

                var priceAmount = $('[property=\'product:price:amount\']');
                if (priceAmount.length == 1) {
                    var priceString = priceAmount[0].attribs.content;
                    this.product.price = this.cleanAmount(priceString);
                }

                var priceCurrency = $('[property=\'product:price:currency\']');
                if (priceCurrency.length == 1)
                    this.product.currency = this.cleanCurrency(priceCurrency[0].attribs.content);

                var priceCurrencyOg = $('[property=\'og:price:currency\']');
                if (priceCurrencyOg.length == 1)
                    this.product.currency = this.cleanCurrency(priceCurrencyOg[0].attribs.content);

                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    //LETS do some dirty checks:
                    if ($('.woocommerce-Price-amount').length > 0) {
                        var priceString = $('.woocommerce-Price-amount').first().clone()  //clone the element
                            .children() //select all the children
                            .remove()   //remove all the children
                            .end()  //again go back to selected element
                            .text();
                        this.product.price = this.cleanAmount(priceString);

                        this.product.currency = this.cleanCurrency($('.woocommerce-Price-amount').first().clone()  //clone the element
                            .children() //select all the children
                            .first()   //remove all the children
                            .text());

                    }
                }
                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    var priceString = $('.price').first().text();
                    this.product.price = this.cleanAmount(priceString);
                    //'something102asdfkj1948948'.match( numberPattern )

                }

                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    var priceProp = $('[itemprop=\'price\']');
                    if (priceProp.length > 0)
                        this.product.price = this.cleanAmount(priceProp[0].attribs.content);
                    var currencyProp = $('[itemprop=\'priceCurrency\']');
                    if (currencyProp.length > 0)
                        this.product.currency = this.cleanCurrency(priceDifs.first().text());
                }


                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    var priceDifs = $('div.productPrice');
                    if (priceDifs.length > 0) {
                        this.product.price = this.cleanAmount(priceDifs.first().text())
                        this.product.currency = this.cleanCurrency(priceDifs.first().text());
                    }
                }

                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    var priceDifs = $('.money').first().text().split(".")
                    if (priceDifs.length > 0) {
                        var i = 0

                        while (this.product.price == 0 && i < priceDifs.length) {
                            //console.log(priceDifs[i]);
                            this.product.price = this.cleanAmount(priceDifs[i]);
                            this.product.currency = this.cleanCurrency(priceDifs[i]);
                            i++;
                        }
                    }
                }

                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    console.log("no price found yet .... rule 382")
                    this.product.price = this.cleanAmount($('p.c-price__txt').first().text());
                    this.product.currency = this.cleanCurrency($('p.c-price__txt').first().text());
                }

                if (typeof this.product.price === 'undefined' || !this.product.price) {
                    this.product.price = 0;
                }

                this.product.name = $('h2.heading-17').first().text().replace(/\s\s+/g, ' ').trim();


                if (this.product.name == null || this.product.name == '') {
                    this.product.name = $('.product_title').first().text().replace(/\s\s+/g, ' ').trim(); //coco & kidney doesn't contain title tag ... my god
                }

                if (this.product.name == null || this.product.name == '') {
                    this.product.name = $('title').first().text().replace(/\s\s+/g, ' ').trim();
                }

                this.product.description = this.cleanString(this.getMetaContent($, 'description'));

                this.product.tags = this.product.tags.concat(this.product.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").split('-'));
                //product.tags = this.product.tags.concat(product.description.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").split('-'));

                this.product.tags = Array.from(new Set(this.product.tags));

                this.product.domain = this.data.domain

                if (this.data.domain == "stinegoya.com") {
                    this.product.currency = "EUR";
                }


                if (this.data.selector) {
                    for (let [key, value] of Object.entries(this.data.selector)) {
                        console.log('KEEEYS', key, value);

                        if (value && key !== 'id') {
                            console.log('value: ', value);

                            // going 
                            const fieldSelector: FieldSelector = <FieldSelector>JSON.parse(<string>value);

                            let result = $(fieldSelector.identifier)

                            for (const method of fieldSelector.methods) {
                                result = method.parameters ? result[method.name](method.parameters) : result[method.name]();
                            }

                            if (key === 'options') {
                                const options = [];

                                result.each((i, op) => {
                                    options.push($(op).val());
                                })

                                this.product[key] = options;

                                continue;
                            }

                            if (key === 'breadcrumps') {
                                const breadcrumps = [];

                                result.children().first().children().each((i, el) => {
                                    const breadcrump = $(el).text();
                                    if(breadcrump !== '') {
                                        breadcrumps.push($(el).text());
                                    }
                                })

                                this.product[key] = breadcrumps;

                                console.log('breadcrumps', breadcrumps)

                                continue;
                            }

                            this.product[key] = result;
                        }
                    }
                }
            }

            console.log(this.product);
            return this.product;
        }
    }
}
