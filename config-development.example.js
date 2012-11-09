
var config = module.exports = {

  mailer: {
    service: 'Gmail',
    auth: {
      user: 'sluzby@skolajs.cz',
      pass: 'very_secret_password'
    },
    defaults: {
      from: 'ŠkolaJs <sluzby@skolajs.cz>',
      subject: 'Novinky na SkolaJs.cz',
      replyTo: 'ŠkolaJs <sluzby@skolajs.cz>',
      generateTextFromHTML: true
    }
  }

};

// chain prototype to inherit default options
config.__proto__ = require('./config');


// disable caching
config.middleware.static.maxAge = 0;
