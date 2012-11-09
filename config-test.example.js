
var config = module.exports = {

  mongo: {
    connectionString: 'mongodb://127.0.0.1:37017/skolajstest'
  }

};

// chain prototype to inherit default options from development profile
config.__proto__ = require('./config-development');
