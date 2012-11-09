
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timon = require('mongoose-timon');



var JsReference = new Schema({
  urlId: {
    type: String,
    index: { unique: true },
    required: true
  },
  idents: [{
    type: String,
    index: { unique: true },
    required: true
  }],
  tags: [{
    type: String,
    index: true
  }],
  title: String,

  markdown: String,

  html: String,

  browserTestScript: String,
  browsers: [BrowserSupport]

}, { _id: false });



JsReference.plugin(timon.timestamps);



User.statics.findOneByUrl = function(url, cb) {
  this.find({ 'urlId': url }, function(err, users) {
    cb(err, users && users[0]);
  });
};



User.methods.setPassword = function(password, cb) {
  var self = this;

  bcrypt.genSalt(BCRYPT_SALT_ROUNDS, BCRYPT_SALT_ROUNDS, function(err, salt) {
    if (err) return cb(err, false);
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return cb(err, false);
      self.pwd = hash;
      cb(null, true);
    });
  });
};



User.methods.validatePassword = function(password, cb) {
  if (!this.pwd) {
    return cb(new Error('Přihlášení heslem není možné'), false);
  }
  bcrypt.compare(password, this.pwd, cb);
};


// used when provided out to request and views
User.virtual('loggedIn').get(function() {
  return true;
});



User.methods.toString = function() {
  return this.nickname;
};



User.methods.getPrimaryEmail = function() {
  var email = this.emails[0];
  return email && email.email;
};


// Anonymous user provided out to request and views
User.statics.anonymous = function() {
  return {
    loggedIn: false,
    nickname: '',
    emails: [],
    getPrimaryEmail: function() {},
    toString: function() { return 'nepřihlášený'; }
  };
};


module.exports = User;
