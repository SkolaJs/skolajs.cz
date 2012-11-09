
module.exports = function(app, config) {

  app.Redis = require('redis');
  app.redisCreateClient = function() {
    if (config.redis.socket) {
      config.redis.port = config.redis.socket;
      config.redis.host = null;
    }

    return app.Redis.createClient(config.redis.port,
                                  config.redis.host,
                                  config.redis.options);
  };
  app.redis = app.redisCreateClient();

  require('../model/redis').setup(app, config);

};
