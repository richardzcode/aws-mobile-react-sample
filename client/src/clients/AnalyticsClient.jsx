import AWS from 'aws-sdk';
import AMA from 'aws-sdk-mobile-analytics';

import AppConfig from '../configuration/AppConfig';

AWS.config.region = AppConfig.Cognito.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AppConfig.Cognito.identity_pool_id
});

/**
* @namespace Analytics
*/

/**
* The client class that communicates with AWS Mobile Analytics
* @class AnalyticsClient
* @memberof Analytics
*/
export default class AnalyticsClient {
    constructor() {
        this.ama_manager = null;
    }

    getManager() {
        if (this.ama_manager === null) {
            this.ama_manager = new AMA.Manager({
                appId: AppConfig.Analytics.app_id,
                logger: console
            });
        }
        return this.ama_manager;
    }

    /**
    * Record an event
    * @method recordEvent
    * @memberof AnalyticsClient
    *
    * @param {string} event_name - Event name
    * @param {object} [attributes] - Additional attribute key-value pairs
    * @param {object} [metrics] - Metrics key-value pairs
    */
    recordEvent(event_name, attributes = {}, metrics = {}) {
        this.getManager().recordEvent(event_name, attributes, metrics);
    }

    /**
    * Record an monetization event
    * @method recordMonetizationEvent
    * @memberof AnalyticsClient
    *
    * @param {object} sales - Sales details
    <pre>
        {
            productId : PRODUCT_ID,   //Required e.g. 'My Example Product'
            price : PRICE,            //Required e.g. 1.99
            quantity : QUANTITY,      //Required e.g. 1
            currency : CURRENCY_CODE  //Optional ISO currency code e.g. 'USD'
        }
    </pre>
    * @param {object} [attributes] - Additional attribute key-value pairs
    * @param {object} [metrics] - Metrics key-value pairs
    */
    recordMonetizationEvent(sales, attributes = {}, metrics = {}) {
        this.getManager().recordMonetizationEvent(sales, attributes, metrics);
    }
};

/**
* A helper class for count metrics
* @class Counter
* @memberof Analytics
*/
export class Counter {
    /**
    * @constructor
    * @memberof Counter
    *
    * @param {string} name - Counter name
    * @param {AnalyticsClient} [client] - The client instance,
    *                                     if not provided then instantiate a default client
    */
    constructor(name, client) {
        this.name = name;
        this.client = client || new AnalyticsClient();
    }

    /**
    * Record a count
    * @method count
    * @param {int} [n] - Count, default 1
    * @param {object} [attributes] - Additional attributes
    */
    count(n = 1, attributes = {}) {
        this.client.recordEvent(
            this.name,
            attributes,
            { count: n }
        );
    }
};

/**
* A helper class for sales bookkeeping
* @class SalesBook
* @memberof Analytics
*/
export class SalesBook {
    /**
    * @constructor
    * @memberof SalesBook
    *
    * @param {string} name - Sales book name
    * @param {AnalyticsClient} [client] - The client instance,
    *                                     if not provided then instantiate a default client
    */
    constructor(name, client) {
        this.name = name;
        this.client = client || new AnalyticsClient();
    }

    /**
    * Record a sales event
    * @method record
    * @param {string} product - product identification
    * @param {float} price - unit price
    * @param {number} quantity - number of unit purchased
    * @param {string} [currency] - ISO currency code, default 'USD'
    * @param {object} [attributes] - Additional attributes
    * @param {object} [metrics] - Additional metrics
    */
    record(product, price, quantity, currency = 'USD', attributes={}, metrics={}) {
        attributes = Object.assign({ name: this.name}, attributes);
        this.client.recordMonetizationEvent({
            productId: product,
            price: price,
            quantity: quantity,
            currency: currency
        },
        Object.assign({ name: this.name}, attributes),
        metrics);
    }
};
