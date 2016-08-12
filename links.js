'use strict';

const Nightmare = require('nightmare');
const vo = require('vo');
const config = require('./config.js');
const mysql = require("mysql");

const linkSelector = 'a[href^="htt"]'

const linksUrls = [
    { url: "http://www.lojaskalifa.com.br" },
    { url: "http://www.sephora.com.br" },
    { url: 'http://www.brasilaudio.com.br/lojadesom/' },
    { url: 'http://www.audiodriver.com.br/' }
]

vo(link)(function (err, result) {
    if (err) throw err;
});

function* link() {
    try {
        console.log('Running links...');
        for (let index = 0, element; element = linksUrls[index]; index++) {
            let nightmare = Nightmare();

            yield nightmare
                .goto(element.url)
                .wait(linkSelector);

            element.links = yield nightmare
                .evaluate(function (selector) {
                    let browserLinks = document.querySelectorAll(selector);
                    let newBrowserLinks = []
                    for (let x = 0, bl; bl = browserLinks[x]; x++) {
                        newBrowserLinks.push({ url: bl.getAttribute('href'), title: bl.innerText });
                    }
                    return newBrowserLinks
                }, linkSelector);

            for (let index = 0, l; l = element.links[index]; index++) {
                console.log(`Link: ${JSON.stringify(l)}`);
                let con = mysql.createConnection(config);
                con.query(`INSERT INTO base_url(bsu_url,bsu_titulo,bsu_data,fk_teruya_sites) VALUES("${l.url} ","${l.title}",curdate(),14)`);
                con.end();
            }

            console.log('Fim...');
            yield nightmare.end();
        }
    } catch (error) {
        console.log(error);
    }
}