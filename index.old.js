var URLS2SCRAP = [
    //"http://www.lojaskalifa.com.br",
    //"http://www.sephora.com.br",
    //'http://www.brasilaudio.com.br/lojadesom/',
    //'http://www.audiodriver.com.br/'
];

var mysql = require("mysql");
var Xray = require('x-ray');
var x = Xray();
var config = require('./config');
var requests = 0;
var responses = 0;
/**
 *  x-ray index.js linha 166 
 *  var $ = html ? html.html ? html : cheerio.load(html) : cheerio.load('<html><head></head><body></body></html>');
 */
function scrap(URLS) {
    URLS.forEach(function (current) {
        x(current, 'html', {
            items: ['a@href']
        })(function (err, obj) {
            var con = mysql.createConnection(config);
            if (err) throw new Error(err);
            else {
                if (obj.items.length > 0) {
                    obj.items.forEach(function (current) {
                        if (current) {
                            if (current.indexOf('http') > -1) {
                                requests++
                                try {
                                    x(current, 'html', {
                                        title: 'title'
                                    })(getTitle.bind(null, con, current))
                                } catch (e) {
                                    console.log('***Erro na pagina: ', current)
                                }
                            }
                        }
                    })
                } else {
                    console.log('*** Nenhum link encontrado ***')
                }
            }
        });
    })
}

function getTitle(con, current, err, obj) {
    responses++
    var title = obj ? obj.title.trim() : '';
    console.log('Salvando :', current, ' ', title);
    con.query('INSERT INTO base_url(bsu_url,bsu_titulo,bsu_data,fk_teruya_sites) ' +
        'VALUES("' + current + '","' + title + '",curdate(),14)', function (current, err, rows) {
            if (err) console.log(err);

            if (requests === responses) {
                console.log('*** Encerando conexão ***');
                con.end();
            }
        });
}


scrap(URLS2SCRAP);