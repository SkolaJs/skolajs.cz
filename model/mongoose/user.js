
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timon = require('mongoose-timon');
var bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 10;
var BCRYPT_SALT_SEED_LENGTH = 20;


// note that name part of email is CASE SENSITIVE, domain part not
// but to avoid duplicate registration I lowercase whole email
// users who uses case sensitive email
function normalizeEmail(val) {
  this.normalized = val.toLowerCase();
  return val.replace(/@.+$/, function(match) {
    return match.toLowerCase();
  });
}



// sub - collection
var Email = new Schema({
  email: {
    type: String,
    trim: true,
    match: /^[a-zA-Z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    required: true,
    set: normalizeEmail
  },
  normalized: {
    type: String,
    required: true,
    index: { unique: true, sparse: true }
  },
  public: Boolean,
  verified: String
}, { _id: false });



var User = new Schema({
  nickname: {
    type: String,
    trim: true,
    required: true,
    index: { unique: true }
  },
  pwd: String,
  acl: [String],
  emails: [Email]
});



User.plugin(timon.timestamps);



User.statics.findOneByEmail = function(email, cb) {
  this.find({ 'emails.normalized': email.toLowerCase() }, function(err, users) {
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



User.methods.hasPermission = function(permission) {
  return this.acl.indexOf(permission) !== -1;
};



// Anonymous user provided out to request and views
User.statics.anonymous = function() {
  return {
    loggedIn: false,
    nickname: '',
    acl: [],
    emails: [],
    hasPermission: function() { return false; },
    getPrimaryEmail: function() {},
    toString: function() { return 'nepřihlášený'; }
  };
};


module.exports = User;
