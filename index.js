'use strict';

const Nightmare = require('nightmare');
const vo = require('vo');
const config = require('./config.js');

vo(run)(function(err, result) {
  if (err) throw err;
});

function *run(){
    let nightmare = Nightmare();

    yield nightmare
        .goto('https://www.instagram.com/accounts/login/')
        .end();

    console.log("It's working");
}
