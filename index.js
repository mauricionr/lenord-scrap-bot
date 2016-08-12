'use strict';

const Nightmare = require('nightmare');
const vo = require('vo');
const config = require('./config.js');

vo(run)(function(err, result) {
  if (err) throw err;
});

function *run(){
    try {
        let mysql = require("mysql");
        let nightmare = Nightmare();
        let currentSelector = '.product-options-bottom > div + div + div > .regular-price > .price > .v';
        let requestURL = 'http://www.socourus.com.br/mochila-hang-loose-mosaico-hl1112';
        
        yield nightmare
            .goto(requestURL)
            .wait(currentSelector);

        let price = yield nightmare
            .evaluate(function(selector){
                return document.querySelector(selector).innerHTML;
        }, currentSelector);

        yield nightmare
            .end();

        console.log("It's working : ", price);
        console.log(config);
    } catch (error) {
        console.log(error);
    }
}