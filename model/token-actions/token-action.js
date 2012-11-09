
var util = require('util');
var crypto = require('crypto');
var async = require('async');



exports = module.exports = TokenAction;


// name is for example 'set-password'
// data is object
function TokenAction(name, data) {
  this.id = null;
  this.data = data || {};
  this.data.name = name;
}



// call once
TokenAction.setup = function(app, config) {
  TokenAction.app = app;
  TokenAction.prefix = config.tokenAction.prefix || 'act:';
  // TTL - time to live - default 7 days
  TokenAction.TTL = config.tokenAction.ttl || 60 * 60 * 24 * 7;
};


// dictionary for all available actions
TokenAction.actions = {};


// inherits
TokenAction.register = function(name, childClass) {
  util.inherits(childClass, TokenAction);

  childClass.create = function(data) {
    return new childClass(data);
  };

  TokenAction.actions[name] = childClass;
};



// create cryptographically strong key
TokenAction.createUID = function(cb) {
  crypto.randomBytes(33, function(err, data) {
    if (err) return cb(err);

    // RFC4648 - Base 64 Encoding with URL and Filename Safe Alphabet
    // this does not check for '=' padding char!
    var str = data.toString('base64')
                  .replace(/[\+\/]/g,
                           function(m) { return (m == '+') ? '-' : '_'; });

    return cb(null, str);
  });
};



TokenAction.create = function(name, data, id) {
  var action = new (TokenAction.actions[name])(data);
  if (id)
    action.id = id;
  return action;
};



TokenAction.load = function(id, callback) {
  TokenAction.app.redis.get([TokenAction.prefix + id], function(err, val) {
    if (err) return callback(err);
    if (!val) return callback(null, null);
    val = JSON.parse(val);
    callback(null, TokenAction.create(val.name, val, id));
  });
};



TokenAction.prototype.getTTL = function() { return TokenAction.TTL; };



TokenAction.prototype.save = function(callback) {
  if (this.id) return cb(new Error('Action already saved!'));

  var self = this;
  TokenAction.createUID(function(err, id) {
    if (err) return cb(err);
    self.id = id;
    TokenAction.app.redis.setex([TokenAction.prefix + id, self.getTTL(),
                                 JSON.stringify(self.data)], callback);
  });
};



TokenAction.prototype.delete = function(callback) {
  if (!this.id) return cb(new Error('Action has no ID!'));

  callback = callback || function() { };

  TokenAction.app.redis.del([TokenAction.prefix + this.id], callback);
};



TokenAction.prototype.sendMail = function(callback) {
  var emailOpts = this.getEmailOptions();

  var tasks = {};
  if (emailOpts.htmlTemplate)
    tasks.html = TokenAction.app.render.bind(
        TokenAction.app, 'actions/' + emailOpts.htmlTemplate, {action: this});

  if (emailOpts.textTemplate)
    tasks.text = TokenAction.app.render.bind(
        TokenAction.app, 'actions/' + emailOpts.textTemplate, {action: this});

  async.parallel(tasks, function(err, results) {
    if (err) return callback(err);

    if (results.html)
      emailOpts.html = results.html;

    if (results.text)
      emailOpts.text = results.text;

    return TokenAction.app.sendMail(emailOpts, callback);
  });
};


TokenAction.prototype.render = function(req, res) {
  res.locals.action = this;
  res.render('actions/' + this.templateName);
};



TokenAction.prototype.get = function(req, res) {
  this.render(req, res);
};


// virtual method
TokenAction.prototype.post = function(req, res, next) {
  return next(new Error('Not implemented!'));
};
