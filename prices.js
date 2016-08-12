'use strict';

const Nightmare = require('nightmare');
const vo = require('vo');
const config = require('./config.js');
const mysql = require("mysql");

let priceUrls = [
    {
        selector: '.product-options-bottom > div + div + div > .regular-price > .price > .v',
        url: 'http://www.socourus.com.br/mochila-hang-loose-mosaico-hl1112'
    }
]

vo(price)(function (err, result) {
    if (err) throw err;
});

function* price() {
    try {
        console.log('Running prices...');
        for (let index = 0, element; element = priceUrls[index]; index++) {
            let nightmare = Nightmare();

            yield nightmare
                .goto(element.url)
                .wait(element.selector);

            let price = yield nightmare
                .evaluate(function (selector) {
                    return document.querySelector(selector).innerHTML;
                }, element.selector);

            console.log('Price:', price);

            yield nightmare.end();
        }
    } catch (error) {
        console.log(error);
    }
}